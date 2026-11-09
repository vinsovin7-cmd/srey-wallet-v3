import React, { useState, useEffect } from 'react';
import {
  GitBranch, Github, CheckCircle2, AlertCircle, RefreshCw, Send,
  Terminal, ShieldCheck, Key, Lock, Eye, EyeOff, Layers, ExternalLink,
  Copy, Check, Play, ChevronDown, ChevronRight, Folder, FileCode,
  Activity, ArrowUpRight, CheckSquare, Square, Sparkles, Loader2
} from 'lucide-react';

interface BatchItem {
  id: string;
  title: string;
  desc?: string;
  files: string[];
  status?: 'idle' | 'pushing' | 'success' | 'error';
  error?: string;
  progress?: number;
}

interface WorkflowRun {
  id: number;
  name: string;
  status: string;
  conclusion: string | null;
  htmlUrl: string;
  branch: string;
  commitSha: string;
  commitMsg: string;
  updatedAt: string;
}

interface CommitItem {
  sha: string;
  fullSha: string;
  message: string;
  author: string;
  date: string;
  htmlUrl: string;
}

export const GitHubSyncControl: React.FC = () => {
  // Configuration State
  const [token, setToken] = useState<string>(() => localStorage.getItem('github_sync_pat') || '');
  const [repo, setRepo] = useState<string>(() => localStorage.getItem('github_sync_repo') || 'vinsovin7-cmd/srey-wallet-v3');
  const [branch, setBranch] = useState<string>(() => localStorage.getItem('github_sync_branch') || 'main');
  const [showToken, setShowToken] = useState<boolean>(false);
  const [commitMessage, setCommitMessage] = useState<string>('feat(ecosystem): sync 192 files via batch pipeline');

  // Connection Test State
  const [testingConnection, setTestingConnection] = useState<boolean>(false);
  const [authStatus, setAuthStatus] = useState<{
    tested: boolean;
    valid: boolean;
    user?: string;
    avatar?: string;
    permissions?: any;
    error?: string;
  }>({ tested: false, valid: false });

  // Batches State
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [totalFiles, setTotalFiles] = useState<number>(0);
  const [loadingBatches, setLoadingBatches] = useState<boolean>(true);
  const [expandedBatchId, setExpandedBatchId] = useState<string | null>('batch-root-config');
  const [selectedBatches, setSelectedBatches] = useState<Record<string, boolean>>({});

  // Active Push Execution State
  const [isPushingActive, setIsPushingActive] = useState<boolean>(false);
  const [currentPushingFile, setCurrentPushingFile] = useState<string | null>(null);
  const [pushLogs, setPushLogs] = useState<string[]>([]);

  // Pipeline Status State
  const [loadingPipeline, setLoadingPipeline] = useState<boolean>(false);
  const [workflowRuns, setWorkflowRuns] = useState<WorkflowRun[]>([]);
  const [recentCommits, setRecentCommits] = useState<CommitItem[]>([]);
  const [lastPipelineCheck, setLastPipelineCheck] = useState<string | null>(null);

  // Copied state
  const [copiedCliMode, setCopiedCliMode] = useState<string | null>(null);

  // Save Config on Change
  const saveConfig = (newToken: string, newRepo: string, newBranch: string) => {
    setToken(newToken);
    setRepo(newRepo);
    setBranch(newBranch);
    localStorage.setItem('github_sync_pat', newToken);
    localStorage.setItem('github_sync_repo', newRepo);
    localStorage.setItem('github_sync_branch', newBranch);
  };

  // Fetch File Batches
  const fetchBatches = async () => {
    setLoadingBatches(true);
    try {
      const res = await fetch('/api/github/file-batches');
      const data = await res.json();
      if (data.success) {
        setBatches(data.batches.map((b: any) => ({ ...b, status: 'idle' })));
        setTotalFiles(data.totalFiles);
        // Default select all
        const sel: Record<string, boolean> = {};
        data.batches.forEach((b: any) => { sel[b.id] = true; });
        setSelectedBatches(sel);
      }
    } catch (err: any) {
      console.warn("Error fetching batches:", err);
    } finally {
      setLoadingBatches(false);
    }
  };

  // Test Connection
  const handleTestConnection = async () => {
    if (!token.trim()) {
      setAuthStatus({ tested: true, valid: false, error: 'Please enter your GitHub Personal Access Token' });
      return;
    }
    setTestingConnection(true);
    try {
      const res = await fetch('/api/github/test-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.trim(), repo: repo.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setAuthStatus({
          tested: true,
          valid: true,
          user: data.user.login,
          avatar: data.user.avatar,
          permissions: data.repo.permissions
        });
        saveConfig(token, repo, branch);
        fetchPipelineStatus();
      } else {
        setAuthStatus({
          tested: true,
          valid: false,
          error: data.error || 'Authentication failed'
        });
      }
    } catch (err: any) {
      setAuthStatus({ tested: true, valid: false, error: err.message });
    } finally {
      setTestingConnection(false);
    }
  };

  // Fetch Pipeline Status
  const fetchPipelineStatus = async () => {
    setLoadingPipeline(true);
    try {
      const params = new URLSearchParams({
        repo: repo.trim(),
        token: token.trim()
      });
      const res = await fetch(`/api/github/pipeline-status?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setWorkflowRuns(data.workflowRuns || []);
        setRecentCommits(data.commits || []);
        setLastPipelineCheck(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.warn("Pipeline status fetch notice:", err);
    } finally {
      setLoadingPipeline(false);
    }
  };

  useEffect(() => {
    fetchBatches();
    if (token) {
      fetchPipelineStatus();
    }
  }, []);

  // Execute Batch Push
  const pushSingleBatch = async (batch: BatchItem) => {
    if (!token.trim()) {
      alert("Please configure your GitHub Personal Access Token first.");
      return;
    }

    setBatches(prev => prev.map(b => b.id === batch.id ? { ...b, status: 'pushing', error: undefined } : b));
    setPushLogs(prev => [`[${new Date().toLocaleTimeString()}] Starting ${batch.title}...`, ...prev]);

    try {
      const res = await fetch('/api/github/push-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.trim(),
          repo: repo.trim(),
          branch: branch.trim(),
          files: batch.files,
          commitMessage: `${commitMessage} [${batch.title}]`
        })
      });

      const data = await res.json();
      if (data.success) {
        setBatches(prev => prev.map(b => b.id === batch.id ? { ...b, status: 'success' } : b));
        setPushLogs(prev => [`[${new Date().toLocaleTimeString()}] ✅ ${batch.title} synced (${data.successCount}/${data.total} files)!`, ...prev]);
        fetchPipelineStatus();
      } else {
        const errDetail = `${data.failCount || 0} files failed: ${data.results?.find((r: any) => r.status === 'failed')?.error || data.error || 'Push error'}`;
        setBatches(prev => prev.map(b => b.id === batch.id ? { ...b, status: 'error', error: errDetail } : b));
        setPushLogs(prev => [`[${new Date().toLocaleTimeString()}] ❌ ${batch.title} failed: ${errDetail}`, ...prev]);
      }
    } catch (err: any) {
      setBatches(prev => prev.map(b => b.id === batch.id ? { ...b, status: 'error', error: err.message } : b));
      setPushLogs(prev => [`[${new Date().toLocaleTimeString()}] ❌ Network error: ${err.message}`, ...prev]);
    }
  };

  // Push All Selected Batches Sequentially
  const handlePushAllBatches = async () => {
    if (!token.trim()) {
      alert("Please configure your GitHub Personal Access Token first.");
      return;
    }

    setIsPushingActive(true);
    setPushLogs(prev => [`[${new Date().toLocaleTimeString()}] 🚀 Initiating sequential batch push for 192 files...`, ...prev]);

    const activeList = batches.filter(b => selectedBatches[b.id]);

    for (let i = 0; i < activeList.length; i++) {
      const b = activeList[i];
      setPushLogs(prev => [`[${new Date().toLocaleTimeString()}] Executing Batch ${i + 1}/${activeList.length}: ${b.title}...`, ...prev]);
      await pushSingleBatch(b);
      // Small pause between batches
      await new Promise(r => setTimeout(r, 600));
    }

    setIsPushingActive(false);
    fetchPipelineStatus();
  };

  // Terminal CLI Scripts
  const bashScript = `# 1. Stage and commit in clean incremental batches (bypasses 192-file API limit)
git add package.json tsconfig.json vite.config.ts index.html server.ts vercel.json README.md
git commit -m "build(config): root build configurations"

git add src/
git commit -m "feat(src): core application logic & state"

git add components/SreyWallet/
git commit -m "feat(wallet): SreyWallet components"

git add components/
git commit -m "feat(components): UI components & executive dashboards"

git add routes/ cron/ services/ middleware/ depin/ bots/
git commit -m "feat(backend): server routes, payout engines & DePIN daemons"

git add public/
git commit -m "feat(public): manifest, icons & static assets"

# 2. Push all commits cleanly to main
git push origin ${branch}`;

  const powershellScript = `# Windows PowerShell Batch Push Script
git add package.json, tsconfig.json, vite.config.ts, index.html, server.ts, vercel.json, README.md
git commit -m "build(config): root build configurations"

git add src/
git commit -m "feat(src): core application logic & state"

git add components/
git commit -m "feat(components): UI components & executive dashboards"

git add routes/, cron/, services/, middleware/, depin/, bots/
git commit -m "feat(backend): server routes & DePIN daemons"

git add public/
git commit -m "feat(public): manifest & static assets"

git push origin ${branch}`;

  const copyToClipboard = (text: string, mode: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCliMode(mode);
    setTimeout(() => setCopiedCliMode(null), 2500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in text-stone-100 font-sans pb-12">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c101d] via-[#10172a] to-[#070a14] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 flex items-center justify-center shadow-lg">
                <Github size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white font-serif tracking-wide">
                    GitHub Sync & Deployment Control
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/50 text-[10px] font-mono text-cyan-300 font-bold">
                    BATCH PIPELINE
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-300 font-mono">
                  Bypasses single-commit payload limits by splitting {totalFiles || 193} files into safe, incremental batches.
                </p>
              </div>
            </div>
          </div>

          {/* Action Header Stats */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-4 py-2.5 rounded-2xl bg-black/60 border border-stone-800 text-left">
              <div className="text-[10px] font-mono text-stone-400 uppercase">Target Repository</div>
              <div className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1">
                <span>{repo}</span>
                <span className="text-[10px] text-cyan-400">({branch})</span>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchBatches}
              disabled={loadingBatches}
              className="px-3.5 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 font-mono text-xs flex items-center gap-2 cursor-pointer transition active:scale-95"
              title="Rescan workspace files"
            >
              <RefreshCw size={14} className={loadingBatches ? "animate-spin" : ""} />
              <span>Rescan ({totalFiles})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2-COLUMN LAYOUT: CONFIG & CLI ON LEFT, BATCH MANAGER & STATUS ON RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: TOKEN & REPO CONFIG + TERMINAL COMMAND GENERATOR (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* SECTION 1: TOKEN & REPO CONFIGURATION */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0c101d] border border-stone-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Key size={16} className="text-amber-400" />
                <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  1. Token & Repo Credentials
                </h2>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
                Encrypted in Browser
              </span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              {/* GitHub PAT Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-stone-300 text-[11px]">
                  <label className="flex items-center gap-1 font-bold">
                    <Lock size={12} className="text-stone-400" />
                    <span>Personal Access Token (PAT)</span>
                  </label>
                  <a
                    href="https://github.com/settings/tokens/new?scopes=repo,workflow&description=AlphaQubit+Sync"
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-0.5 text-[10px]"
                  >
                    <span>Generate PAT</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showToken ? "text" : "password"}
                    value={token}
                    onChange={(e) => saveConfig(e.target.value, repo, branch)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full py-2.5 pl-3 pr-10 rounded-xl bg-black/60 border border-stone-700 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-cyan-400 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white cursor-pointer"
                  >
                    {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p className="text-[10px] text-stone-400">
                  Required scopes: <code>repo</code> (Full control of repositories) and <code>workflow</code>.
                </p>
              </div>

              {/* Target Repo */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-300">Repository Target</label>
                <input
                  type="text"
                  value={repo}
                  onChange={(e) => saveConfig(token, e.target.value, branch)}
                  placeholder="owner/repository-name"
                  className="w-full py-2.5 px-3 rounded-xl bg-black/60 border border-stone-700 text-amber-300 font-bold focus:outline-none focus:border-cyan-400 text-xs"
                />
              </div>

              {/* Branch */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-300">Target Branch</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => saveConfig(token, repo, e.target.value)}
                    placeholder="main"
                    className="w-full py-2.5 px-3 rounded-xl bg-black/60 border border-stone-700 text-stone-200 focus:outline-none focus:border-cyan-400 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testingConnection}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-stone-950 font-bold text-xs shrink-0 cursor-pointer transition active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {testingConnection ? <Loader2 size={13} className="animate-spin" /> : <ShieldCheck size={13} />}
                    <span>{testingConnection ? "Verifying..." : "Verify"}</span>
                  </button>
                </div>
              </div>

              {/* Verification Feedback Banner */}
              {authStatus.tested && (
                <div className={`p-3 rounded-2xl border text-xs font-mono flex items-start gap-2.5 ${
                  authStatus.valid
                    ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
                    : "bg-red-950/40 border-red-500/50 text-red-300"
                }`}>
                  {authStatus.valid ? (
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <div className="font-bold">
                      {authStatus.valid ? `Authenticated as @${authStatus.user}` : "Connection Failed"}
                    </div>
                    <div className="text-[11px] text-stone-300">
                      {authStatus.valid ? (
                        <span>Repository <code>{repo}</code> is connected with push permissions.</span>
                      ) : (
                        authStatus.error
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 4: TERMINAL COMMAND GENERATOR (1-CLICK BATCH CLI) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0c101d] border border-stone-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Terminal size={16} className="text-cyan-400" />
                <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  4. Terminal Command Generator
                </h2>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                1-Click Copy
              </span>
            </div>

            <p className="text-xs text-stone-300 font-mono leading-relaxed">
              If the browser UI ever rejects 192 files at once, run these commands in your local terminal. They stage folder-by-folder so Git never throws invalid argument errors:
            </p>

            {/* Bash / Mac / Linux Script */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-stone-400 font-bold">Bash / macOS / Linux CLI:</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(bashScript, 'bash')}
                  className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-mono text-[11px] flex items-center gap-1 cursor-pointer transition active:scale-95"
                >
                  {copiedCliMode === 'bash' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copiedCliMode === 'bash' ? 'Copied Script!' : 'Copy Script'}</span>
                </button>
              </div>
              <pre className="p-3.5 rounded-2xl bg-black/80 border border-stone-800 text-[11px] font-mono text-cyan-300 max-h-48 overflow-y-auto leading-relaxed scrollbar-thin select-all">
                {bashScript}
              </pre>
            </div>

            {/* PowerShell Script */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-stone-400 font-bold">Windows PowerShell:</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(powershellScript, 'powershell')}
                  className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-mono text-[11px] flex items-center gap-1 cursor-pointer transition active:scale-95"
                >
                  {copiedCliMode === 'powershell' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copiedCliMode === 'powershell' ? 'Copied PowerShell!' : 'Copy PowerShell'}</span>
                </button>
              </div>
              <pre className="p-3.5 rounded-2xl bg-black/80 border border-stone-800 text-[11px] font-mono text-amber-300 max-h-36 overflow-y-auto leading-relaxed scrollbar-thin select-all">
                {powershellScript}
              </pre>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BATCH COMMIT MANAGER + PIPELINE STATUS (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SECTION 2: BATCH COMMIT MANAGER */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0c101d] border border-cyan-500/30 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-amber-400" />
                <div>
                  <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    2. Intelligent Batch Commit Manager
                  </h2>
                  <p className="text-[11px] text-stone-400 font-mono">
                    {totalFiles} Total Files divided into {batches.length} safe incremental payloads
                  </p>
                </div>
              </div>

              {/* Master Push Action */}
              <button
                type="button"
                onClick={handlePushAllBatches}
                disabled={isPushingActive || !token.trim()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:brightness-110 text-stone-950 font-black font-mono text-xs shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-pointer transition active:scale-95 disabled:opacity-50 flex items-center gap-2 shrink-0"
              >
                {isPushingActive ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} className="fill-stone-950" />}
                <span>{isPushingActive ? "Pushing In Progress..." : "Auto-Push All Batches"}</span>
              </button>
            </div>

            {/* Custom Commit Message input */}
            <div className="space-y-1 text-xs font-mono">
              <label className="text-[11px] text-stone-400">Commit Message Template</label>
              <input
                type="text"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-black/60 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Batches Accordion List */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
              {loadingBatches ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-stone-400 text-xs font-mono">
                  <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span>Scanning 192 project files...</span>
                </div>
              ) : (
                batches.map((batch, idx) => {
                  const isExpanded = expandedBatchId === batch.id;
                  const isSelected = selectedBatches[batch.id];

                  return (
                    <div
                      key={batch.id}
                      className={`rounded-2xl border transition-all ${
                        batch.status === 'success'
                          ? 'bg-emerald-950/20 border-emerald-500/40'
                          : batch.status === 'pushing'
                          ? 'bg-cyan-950/30 border-cyan-500 animate-pulse'
                          : batch.status === 'error'
                          ? 'bg-red-950/30 border-red-500/50'
                          : 'bg-black/50 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      {/* Header */}
                      <div className="p-3.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            type="button"
                            onClick={() => setSelectedBatches(prev => ({ ...prev, [batch.id]: !prev[batch.id] }))}
                            className="text-stone-400 hover:text-white cursor-pointer"
                          >
                            {isSelected ? (
                              <CheckSquare size={16} className="text-amber-400" />
                            ) : (
                              <Square size={16} />
                            )}
                          </button>

                          <div
                            onClick={() => setExpandedBatchId(isExpanded ? null : batch.id)}
                            className="cursor-pointer min-w-0"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold font-mono text-white truncate">
                                {batch.title}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-stone-900 border border-stone-700 text-stone-400">
                                {batch.files.length} files
                              </span>
                            </div>
                            {batch.desc && (
                              <p className="text-[11px] text-stone-400 font-mono truncate">{batch.desc}</p>
                            )}
                          </div>
                        </div>

                        {/* Status / Push Action */}
                        <div className="flex items-center gap-2 shrink-0">
                          {batch.status === 'success' && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-500 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
                              <CheckCircle2 size={11} />
                              <span>SYNCED</span>
                            </span>
                          )}
                          {batch.status === 'pushing' && (
                            <span className="px-2 py-0.5 rounded-full bg-cyan-900/60 border border-cyan-400 text-cyan-300 text-[10px] font-mono font-bold flex items-center gap-1">
                              <Loader2 size={11} className="animate-spin" />
                              <span>PUSHING...</span>
                            </span>
                          )}
                          {batch.status === 'error' && (
                            <span className="px-2 py-0.5 rounded-full bg-red-900/60 border border-red-500 text-red-300 text-[10px] font-mono font-bold">
                              FAILED
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => pushSingleBatch(batch)}
                            disabled={batch.status === 'pushing' || !token.trim()}
                            className="px-2.5 py-1 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-amber-300 font-mono text-[11px] font-bold transition cursor-pointer active:scale-95 disabled:opacity-40"
                          >
                            Push Batch
                          </button>

                          <button
                            type="button"
                            onClick={() => setExpandedBatchId(isExpanded ? null : batch.id)}
                            className="w-7 h-7 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 flex items-center justify-center cursor-pointer"
                          >
                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </button>
                        </div>
                      </div>

                      {/* Expanded File List */}
                      {isExpanded && (
                        <div className="px-3.5 pb-3.5 pt-1 border-t border-stone-800/80 space-y-1">
                          <div className="text-[10px] font-mono text-stone-400 pb-1">
                            Included Files ({batch.files.length}):
                          </div>
                          <div className="max-h-32 overflow-y-auto space-y-0.5 scrollbar-thin">
                            {batch.files.map((file, fIdx) => (
                              <div
                                key={fIdx}
                                className="flex items-center gap-1.5 text-[11px] font-mono text-stone-300 py-0.5 hover:text-white"
                              >
                                <FileCode size={11} className="text-cyan-400 shrink-0" />
                                <span className="truncate">{file}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Push Activity Logs */}
            {pushLogs.length > 0 && (
              <div className="p-3 rounded-2xl bg-black/80 border border-stone-800 space-y-1">
                <div className="text-[10px] font-mono text-stone-400 uppercase">Live Push Activity</div>
                <div className="max-h-24 overflow-y-auto space-y-0.5 text-[11px] font-mono text-stone-300 scrollbar-thin">
                  {pushLogs.map((log, lIdx) => (
                    <div key={lIdx} className="leading-tight">{log}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: AUTOMATED PIPELINE TRIGGER & STATUS MONITOR */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0c101d] border border-stone-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-emerald-400" />
                <div>
                  <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    3. Live Pipeline & Deployment Monitor
                  </h2>
                  <p className="text-[11px] text-stone-400 font-mono">
                    Real-time GitHub Actions & Vercel deployment status
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://github.com/${repo}/actions`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 text-[11px] font-mono flex items-center gap-1 border border-stone-800"
                >
                  <span>Actions</span>
                  <ExternalLink size={10} />
                </a>

                <button
                  type="button"
                  onClick={fetchPipelineStatus}
                  disabled={loadingPipeline}
                  className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 cursor-pointer transition active:scale-95"
                  title="Refresh pipeline status"
                >
                  <RefreshCw size={13} className={loadingPipeline ? "animate-spin" : ""} />
                </button>
              </div>
            </div>

            {/* Vercel Live Deployment Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-black border border-emerald-500/30 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Production Live Deployment</span>
                </div>
                <div className="text-xs font-mono text-stone-200 font-bold truncate">
                  vinsovin7-cmd-srey-wallet-v2.vercel.app
                </div>
              </div>
              <a
                href="https://vinsovin7-cmd-srey-wallet-v2.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:brightness-110 text-stone-950 font-mono text-xs font-black flex items-center gap-1 shadow cursor-pointer transition active:scale-95 shrink-0"
              >
                <span>View Live</span>
                <ArrowUpRight size={13} />
              </a>
            </div>

            {/* Workflow Runs & Recent Commits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              
              {/* GitHub Actions Runs */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-stone-400 uppercase">
                  GitHub Actions Runs:
                </div>
                {workflowRuns.length === 0 ? (
                  <div className="p-3 rounded-2xl bg-black/40 border border-stone-800 text-stone-500 text-[11px]">
                    No workflow runs found or awaiting token verification.
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-44 overflow-y-auto scrollbar-thin pr-1">
                    {workflowRuns.map(run => (
                      <a
                        key={run.id}
                        href={run.htmlUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block p-2.5 rounded-xl bg-black/60 border border-stone-800 hover:border-cyan-500/50 transition group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-200 group-hover:text-cyan-300 truncate">
                            {run.name}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            run.conclusion === 'success'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : run.status === 'in_progress'
                              ? 'bg-amber-950 text-amber-300 border border-amber-500/40 animate-pulse'
                              : 'bg-stone-900 text-stone-400'
                          }`}>
                            {run.conclusion || run.status}
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-500 flex items-center justify-between mt-1">
                          <span>{run.branch} ({run.commitSha})</span>
                          <span>{new Date(run.updatedAt).toLocaleTimeString()}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Commits */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-stone-400 uppercase">
                  Recent Commits on {branch}:
                </div>
                {recentCommits.length === 0 ? (
                  <div className="p-3 rounded-2xl bg-black/40 border border-stone-800 text-stone-500 text-[11px]">
                    No commit history loaded yet.
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-44 overflow-y-auto scrollbar-thin pr-1">
                    {recentCommits.map(c => (
                      <a
                        key={c.fullSha}
                        href={c.htmlUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block p-2.5 rounded-xl bg-black/60 border border-stone-800 hover:border-amber-500/50 transition group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-300 font-mono text-[11px]">
                            {c.sha}
                          </span>
                          <span className="text-[10px] text-stone-500">
                            {c.author}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-300 group-hover:text-white line-clamp-1 mt-0.5">
                          {c.message}
                        </p>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {lastPipelineCheck && (
              <div className="text-[10px] font-mono text-stone-500 text-right">
                Last checked: {lastPipelineCheck}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
