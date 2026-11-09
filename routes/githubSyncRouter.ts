import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

export const githubSyncRouter = Router();

// Helper to recursively collect all project files
function collectProjectFiles(dir: string, base: string = ''): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (['node_modules', '.git', 'dist', 'dist-ssr', '.aistudio', '.turbo', 'coverage'].includes(entry.name)) {
      continue;
    }
    // Block environment secrets and credential files (prevents GitHub Secret Scanning push rejection)
    if (
      entry.name === '.env' ||
      entry.name === '.env.local' ||
      (entry.name.startsWith('.env.') && !entry.name.endsWith('.example')) ||
      entry.name === 'firebase-applet-config.json' ||
      entry.name.endsWith('.key') ||
      entry.name.endsWith('.pem')
    ) {
      continue;
    }
    const rel = base ? `${base}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results = results.concat(collectProjectFiles(full, rel));
    } else {
      if (entry.name.endsWith('.zip')) continue;
      if (entry.name.endsWith('.png') && rel.includes('aistudio')) continue;
      results.push(rel);
    }
  }
  return results;
}

// 1. GET File Batches Breakdown
githubSyncRouter.get('/file-batches', (req, res) => {
  try {
    const root = process.cwd();
    const allFiles = collectProjectFiles(root);

    // Group by category/batch
    const rootFiles = allFiles.filter(f => !f.includes('/'));
    const srcFiles = allFiles.filter(f => f.startsWith('src/'));
    const compFiles = allFiles.filter(f => f.startsWith('components/'));
    const backendFiles = allFiles.filter(f => f.startsWith('routes/') || f.startsWith('cron/') || f.startsWith('services/') || f.startsWith('middleware/') || f.startsWith('bots/'));
    const depinFiles = allFiles.filter(f => f.startsWith('depin/'));
    const publicFiles = allFiles.filter(f => f.startsWith('public/'));

    // Split components into chunks of ~30 files to guarantee safe API payloads
    const chunkSize = 30;
    const compBatches: { id: string; title: string; files: string[] }[] = [];
    for (let i = 0; i < compFiles.length; i += chunkSize) {
      const slice = compFiles.slice(i, i + chunkSize);
      const batchNum = Math.floor(i / chunkSize) + 1;
      compBatches.push({
        id: `components-batch-${batchNum}`,
        title: `Components Part ${batchNum} (${slice.length} files)`,
        files: slice
      });
    }

    const batches = [
      {
        id: 'batch-root-config',
        title: `Root & Build Config (${rootFiles.length} files)`,
        desc: 'package.json, tsconfig.json, vite.config.ts, server.ts, index.html, vercel.json',
        files: rootFiles
      },
      ...compBatches,
      {
        id: 'batch-src-core',
        title: `Core Application (${srcFiles.length} files)`,
        desc: 'src/App.tsx, index.tsx, polyfills, services, hooks, and types',
        files: srcFiles
      },
      {
        id: 'batch-backend-depin',
        title: `Backend & DePIN (${backendFiles.length + depinFiles.length} files)`,
        desc: 'Express routes, cron engines, xTwitter services, and DePIN daemons',
        files: [...backendFiles, ...depinFiles]
      },
      {
        id: 'batch-public-assets',
        title: `Public Assets & Manifest (${publicFiles.length} files)`,
        desc: 'Web manifest, icons, previews, and static assets',
        files: publicFiles
      }
    ];

    res.json({
      success: true,
      totalFiles: allFiles.length,
      batches,
      allFiles
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message });
  }
});

// 2. POST Test GitHub Token & Repository Connection
githubSyncRouter.post('/test-token', async (req, res) => {
  const { token, repo = 'vinsovin7-cmd/srey-wallet-v3' } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, error: 'GitHub Personal Access Token (PAT) is required' });
  }

  try {
    const headers = {
      Authorization: `Bearer ${token.trim()}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'AlphaQubit-GitHub-Sync-Control'
    };

    const userRes = await axios.get('https://api.github.com/user', { headers });
    const repoRes = await axios.get(`https://api.github.com/repos/${repo.trim()}`, { headers });

    res.json({
      success: true,
      user: {
        login: userRes.data.login,
        name: userRes.data.name || userRes.data.login,
        avatar: userRes.data.avatar_url
      },
      repo: {
        fullName: repoRes.data.full_name,
        defaultBranch: repoRes.data.default_branch,
        private: repoRes.data.private,
        permissions: repoRes.data.permissions,
        htmlUrl: repoRes.data.html_url
      }
    });
  } catch (err: any) {
    const status = err?.response?.status || 500;
    const msg = err?.response?.data?.message || err?.message || 'Failed to authenticate with GitHub';
    res.status(status).json({ success: false, error: msg });
  }
});

// 3. POST Batch Push Files to GitHub via Contents API
githubSyncRouter.post('/push-batch', async (req, res) => {
  const {
    token,
    repo = 'vinsovin7-cmd/srey-wallet-v3',
    branch = 'main',
    files = [],
    commitMessage = 'feat(batch): sync ecosystem update'
  } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, error: 'GitHub Personal Access Token (PAT) is required' });
  }
  if (!Array.isArray(files) || files.length === 0) {
    return res.status(400).json({ success: false, error: 'No files provided for batch commit' });
  }

  const root = process.cwd();
  const headers = {
    Authorization: `Bearer ${token.trim()}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'AlphaQubit-GitHub-Sync-Control'
  };

  const results: { file: string; status: 'pushed' | 'skipped' | 'failed'; error?: string }[] = [];

  for (const relPath of files) {
    const fullPath = path.join(root, relPath);
    if (!fs.existsSync(fullPath)) {
      results.push({ file: relPath, status: 'skipped', error: 'File does not exist on disk' });
      continue;
    }

    try {
      let buffer = fs.readFileSync(fullPath);
      // Automatic Secret Sanitizer: Scrubs raw API tokens to prevent GitHub Secret Scanning blocks
      const ext = path.extname(relPath).toLowerCase();
      if (['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.html', '.txt', '.example', '.yml', '.yaml'].includes(ext) || !ext) {
        let text = buffer.toString('utf8');
        text = text
          .replace(/sk-or-v1-[a-f0-9]{64}/g, 'sk-or-v1-YOUR_OPENROUTER_API_KEY_HERE')
          .replace(/AIza[0-9A-Za-z-_]{35}/g, 'AIzaSy_YOUR_FIREBASE_API_KEY_HERE')
          .replace(/Nb7qtkt4u9aLp35CKe_8pzCLV6337nPFTQr6hsRTiSXWgkNOJ1/g, 'your_x_client_secret_here')
          .replace(/AGNMQ4KUUOK6SXYAAAAJJV6LH72E3JRIOMPOTS3IBM73SXVKHT4UG2CVO3SEVUXUGUHLIZI/g, 'your_toncenter_api_key_here');
        buffer = Buffer.from(text, 'utf8');
      }

      const base64Content = buffer.toString('base64');

      // Check if file already exists on GitHub to obtain its current SHA
      let currentSha: string | undefined = undefined;
      try {
        const getRes = await axios.get(`https://api.github.com/repos/${repo.trim()}/contents/${relPath}?ref=${branch.trim()}`, { headers });
        if (getRes.data && getRes.data.sha) {
          currentSha = getRes.data.sha;
        }
      } catch (checkErr: any) {
        // 404 means file doesn't exist yet, which is normal for new files
      }

      // Push file content
      const payload: any = {
        message: `${commitMessage} [${path.basename(relPath)}]`,
        content: base64Content,
        branch: branch.trim()
      };
      if (currentSha) {
        payload.sha = currentSha;
      }

      await axios.put(`https://api.github.com/repos/${repo.trim()}/contents/${relPath}`, payload, { headers });
      results.push({ file: relPath, status: 'pushed' });

      // Small delay between calls to respect secondary rate limits
      await new Promise(r => setTimeout(r, 120));
    } catch (pushErr: any) {
      const errMsg = pushErr?.response?.data?.message || pushErr?.message || 'Push error';
      results.push({ file: relPath, status: 'failed', error: errMsg });
    }
  }

  const successCount = results.filter(r => r.status === 'pushed').length;
  const failCount = results.filter(r => r.status === 'failed').length;

  res.json({
    success: failCount === 0,
    total: files.length,
    successCount,
    failCount,
    results
  });
});

// 4. GET Actions Workflow & Deployment Pipeline Status
githubSyncRouter.get('/pipeline-status', async (req, res) => {
  const token = (req.query.token as string) || '';
  const repo = (req.query.repo as string) || 'vinsovin7-cmd/srey-wallet-v3';

  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'AlphaQubit-GitHub-Sync-Control'
    };
    if (token) {
      headers.Authorization = `Bearer ${token.trim()}`;
    }

    const [commitsRes, runsRes] = await Promise.allSettled([
      axios.get(`https://api.github.com/repos/${repo.trim()}/commits?per_page=6`, { headers }),
      axios.get(`https://api.github.com/repos/${repo.trim()}/actions/runs?per_page=6`, { headers })
    ]);

    const commits = commitsRes.status === 'fulfilled' ? commitsRes.value.data.map((c: any) => ({
      sha: c.sha.substring(0, 7),
      fullSha: c.sha,
      message: c.commit.message,
      author: c.commit.author.name,
      date: c.commit.author.date,
      htmlUrl: c.html_url
    })) : [];

    const workflowRuns = runsRes.status === 'fulfilled' ? runsRes.value.data.workflow_runs.map((r: any) => ({
      id: r.id,
      name: r.name,
      status: r.status, // completed, in_progress, queued
      conclusion: r.conclusion, // success, failure, null
      htmlUrl: r.html_url,
      branch: r.head_branch,
      commitSha: r.head_sha.substring(0, 7),
      commitMsg: r.head_commit?.message || '',
      updatedAt: r.updated_at
    })) : [];

    res.json({
      success: true,
      repo,
      commits,
      workflowRuns,
      lastChecked: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message });
  }
});
