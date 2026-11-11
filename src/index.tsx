import './polyfills';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { TonConnectUIProvider, THEME } from '@tonconnect/ui-react';
import App from './App';
import './index.css';

const getTonConnectManifestUrl = (): string => {
  try {
    if (typeof window === 'undefined' || !window.location) {
      return 'https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json';
    }
    const origin = window.location.origin || '';
    if (
      !origin ||
      origin === 'null' ||
      origin.includes('run.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.includes('earnings-platform') ||
      origin.startsWith('file:')
    ) {
      return 'https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json';
    }

    return `${origin}/tonconnect-manifest.json`;
  } catch {
    return 'https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json';
  }
};

const getSafeTwaReturnUrl = (): `${string}://${string}` => {
  try {
    if (typeof window !== 'undefined' && window.location) {
      const origin = window.location.origin;
      if (origin && origin !== 'null' && (origin.startsWith('https://') || origin.startsWith('http://'))) {
        return origin as `${string}://${string}`;
      }
    }
  } catch {}
  return 'https://vinsovin7-cmd-srey-wallet-v2.vercel.app' as `${string}://${string}`;
};

const MANIFEST_URL = getTonConnectManifestUrl();

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn("Sreymara Quantum Guardian caught component error:", error, errorInfo);
  }

  handleRestore = () => {
    this.setState({ hasError: false, error: null });
  };

  handleResetState = () => {
    try {
      // Clear non-essential cached keys
      const keysToKeep = ['connected_ton_wallet', 'connected_trust_wallet', 'srey_connected_address'];
      const preserved: Record<string, string> = {};
      for (const k of keysToKeep) {
        const val = localStorage.getItem(k);
        if (val) preserved[k] = val;
      }
      localStorage.clear();
      for (const [k, v] of Object.entries(preserved)) {
        localStorage.setItem(k, v);
      }
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#05060A] text-white flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
          {/* Ambient Background Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 bg-gradient-to-br from-[#0e1322] via-[#0b0e18] to-[#070910] border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-[0_0_60px_rgba(245,158,11,0.2)] text-center space-y-6">
            {/* Header Badge */}
            <div className="flex items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-300 flex items-center justify-center text-xl font-bold font-serif shadow-lg">
                α
              </div>
              <div className="text-left">
                <h3 className="text-base font-bold text-white font-serif">Executive Sreymara Ecosystem</h3>
                <div className="text-[11px] text-amber-400 font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Quantum Error Guardian Active • Zero Downtime</span>
                </div>
              </div>
            </div>

            {/* Error Details Card */}
            <div className="p-4 rounded-2xl bg-black/60 border border-stone-800 text-left space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold">Status: Isolated Exception Captured</span>
                <span className="text-stone-500">Notice #2026-LIVE</span>
              </div>
              <p className="text-xs font-mono text-stone-300 leading-relaxed break-words bg-stone-900/80 p-3 rounded-xl border border-stone-800/80 max-h-32 overflow-y-auto scrollbar-thin">
                {this.state.error?.message || this.state.error?.toString() || "Temporary render exception caught and isolated safely."}
              </p>
              <div className="text-[11px] text-stone-400 font-mono">
                The ecosystem system state remains secure. Click below to instantly restore your executive dashboard.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleRestore}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:brightness-110 text-stone-950 font-mono text-xs font-black transition shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <span>⚡ RESTORE LIVE DASHBOARD</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetState}
                className="py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 font-mono text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <span>🔄 RESET STATE & RELOAD</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

class TonConnectErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(err: any) {
    console.warn("TonConnect provider caught error, isolating gracefully:", err);
  }

  render() {
    if (this.state.hasError) {
      return <>{this.props.children}</>;
    }
    return this.props.children;
  }
}

function SafeTonConnectProvider({ children }: { children: React.ReactNode }) {
  return (
    <TonConnectErrorBoundary>
      <TonConnectUIProvider
        manifestUrl={MANIFEST_URL}
        uiPreferences={{
          theme: THEME.DARK
        }}
        actionsConfiguration={{
          twaReturnUrl: getSafeTwaReturnUrl()
        }}
      >
        {children}
      </TonConnectUIProvider>
    </TonConnectErrorBoundary>
  );
}

const mountApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <SafeTonConnectProvider>
            <App />
          </SafeTonConnectProvider>
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (mountErr) {
    console.error("Critical mounting exception caught safely:", mountErr);
    // Bulletproof direct render fallback
    try {
      const root = ReactDOM.createRoot(rootElement);
      root.render(
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      );
    } catch (fallbackErr) {
      console.error("Secondary mount fallback exception:", fallbackErr);
    }
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
