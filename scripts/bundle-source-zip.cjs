const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

async function buildZip() {
  const zip = new JSZip();
  const root = path.resolve(__dirname, '..');

  const addDir = (dirPath, zipFolder) => {
    if (!fs.existsSync(dirPath)) return;
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dirPath, e.name);
      if (e.isDirectory()) {
        if (['node_modules', '.git', 'dist', 'dist-ssr', '.aistudio', '.turbo', 'coverage'].includes(e.name)) continue;
        const sub = zipFolder.folder(e.name);
        if (sub) addDir(full, sub);
      } else {
        if (e.name.endsWith('.zip')) continue;
        if (e.name.endsWith('.png') && full.includes('aistudio')) continue;
        try {
          zipFolder.file(e.name, fs.readFileSync(full));
        } catch (err) {}
      }
    }
  };

  ['src', 'components', 'public', 'routes', 'cron', 'services', 'middleware', 'depin'].forEach(d => {
    const full = path.join(root, d);
    if (fs.existsSync(full)) {
      const f = zip.folder(d);
      if (f) addDir(full, f);
    }
  });

  const rootFiles = [
    'package.json', 'tsconfig.json', 'vite.config.ts', 'index.html',
    'server.ts', 'vercel.json', 'README.md', 'DEPLOYMENT_INSTRUCTIONS.md',
    '.gitignore', '.env.example', 'metadata.json', 'types.ts',
    'usePWAInstall.ts', 'manifest.json', 'favicon.svg'
  ];

  for (const rf of rootFiles) {
    const p = path.join(root, rf);
    if (fs.existsSync(p)) {
      try { zip.file(rf, fs.readFileSync(p)); } catch (e) {}
    }
  }

  const buf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 6 } });
  const pubDir = path.join(root, 'public');
  if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });
  fs.writeFileSync(path.join(pubDir, 'srey-wallet-v3-production-source.zip'), buf);
  fs.writeFileSync(path.join(pubDir, 'executive-sreymara-ecosystem-production.zip'), buf);
  console.log(`[ZIP Bundler] Successfully generated clean production source zip: ${buf.length} bytes (~${(buf.length / (1024 * 1024)).toFixed(2)} MB)`);
}

buildZip().catch(console.error);
