import React, { useState } from "react";
import { Zap, Send, Loader2, Bot } from "lucide-react";

export const GeminiInteractionTool: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/interaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.lastStep);
      } else {
        setError(data.error || "Failed to get interaction result");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[#0B0F19] rounded-3xl border border-stone-800 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-white">Gemini Interactions Engine</h2>
          <p className="text-xs text-stone-400">Powered by Gemini Interactions API</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt for Gemini..."
          className="w-full bg-black/60 border border-stone-700 rounded-2xl p-4 text-sm text-white h-32 outline-none focus:border-amber-400"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-black rounded-2xl transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Send size={16} />}
          <span>Run Interaction</span>
        </button>
      </form>

      {error && <div className="p-4 bg-red-950/50 border border-red-500 text-red-300 rounded-2xl text-xs">{error}</div>}
      
      {result && (
        <div className="p-6 bg-stone-900 rounded-2xl border border-stone-700 space-y-2">
          <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Last Interaction Step:</h4>
          <pre className="text-[11px] font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
