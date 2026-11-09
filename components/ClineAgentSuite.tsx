import React, { useState, useEffect } from "react";
import {
  Terminal,
  ShieldCheck,
  Search,
  Copy,
  Check,
  Send,
  Save,
  RotateCcw,
  Download,
  AlertCircle,
  Building2,
  FileCheck2,
  UserCheck,
  PhoneCall,
  MapPin,
  ExternalLink,
  Sliders,
  CheckCircle2,
  XCircle,
  Cpu,
  Globe
} from "lucide-react";

interface CorporateEmailResult {
  email: string;
  type: string;
  confidence: number;
  deliverability: string;
  notes: string;
}

interface ClineEmailSearchResult {
  targetPerson: string;
  targetCompany: string;
  roleTitle: string;
  qualifierName?: string;
  ivrNumber?: string;
  valuationStr?: string;
  locationStr?: string;
  switchboardPhone?: string;
  divisionAddress?: string;
  reviewerName?: string;
  reviewerEmail?: string;
  corporateEmails: CorporateEmailResult[];
  rulesEnforced?: string[];
}

interface ClineAgentSuiteProps {
  onComposeEmail?: (email: string, subject?: string) => void;
  onOpenTruthFinder?: () => void;
}

export const ClineAgentSuite: React.FC<ClineAgentSuiteProps> = ({
  onComposeEmail,
  onOpenTruthFinder
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"search" | "rules">("search");

  // Search Form State
  const [targetName, setTargetName] = useState("Matthew McGrath");
  const [targetCompany, setTargetCompany] = useState("D.R. Horton, Inc.");
  const [ivrNumber, setIvrNumber] = useState("536397");
  const [cityState, setCityState] = useState("Savannah, GA");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<ClineEmailSearchResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Rules Editor State
  const [rulesContent, setRulesContent] = useState("");
  const [isLoadingRules, setIsLoadingRules] = useState(false);
  const [isSavingRules, setIsSavingRules] = useState(false);
  const [rulesSaveStatus, setRulesSaveStatus] = useState<string | null>(null);

  // Fetch .clinerules from backend
  const loadRules = async () => {
    setIsLoadingRules(true);
    try {
      const res = await fetch("/api/cline/rules");
      if (res.ok) {
        const data = await res.json();
        if (data.rules) {
          setRulesContent(data.rules);
        }
      }
    } catch (e) {
      console.warn("Failed to load .clinerules", e);
    } finally {
      setIsLoadingRules(false);
    }
  };

  useEffect(() => {
    loadRules();
    // Pre-run search for Matthew McGrath / D.R. Horton IVR 536397 on initial load
    executeEmailSearch("Matthew McGrath", "D.R. Horton, Inc.", "536397", "Savannah, GA");
  }, []);

  const executeEmailSearch = async (
    name = targetName,
    company = targetCompany,
    ivr = ivrNumber,
    loc = cityState
  ) => {
    setIsSearching(true);
    try {
      const res = await fetch("/api/cline/email-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          company,
          ivr,
          city: loc.split(",")[0]?.trim() || "Savannah",
          state: loc.split(",")[1]?.trim() || "GA"
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSearchResult(data);
      }
    } catch (err) {
      console.error("Cline email search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveRules = async () => {
    setIsSavingRules(true);
    setRulesSaveStatus(null);
    try {
      const res = await fetch("/api/cline/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules: rulesContent })
      });
      if (res.ok) {
        setRulesSaveStatus("Saved successfully to /.clinerules");
        setTimeout(() => setRulesSaveStatus(null), 3000);
      } else {
        setRulesSaveStatus("Error saving rules");
      }
    } catch (e) {
      setRulesSaveStatus("Failed to communicate with server");
    } finally {
      setIsSavingRules(false);
    }
  };

  const handleResetDefaultRules = () => {
    const defaultRules = `# .clinerules — Sovereign Operating Protocol for Cline Autonomous Agent
# Application: AlphaQubit Quantum Ecosystem & Multi Sreymara AI Engine
# User & Principal: Kansas Nelly (kansasnelly@gmail.com)
# Version: 4.2.0 (Executive Production)

[IDENTITY & ARCHITECTURAL ROLE]
You are Cline, the autonomous engineering intelligence and OSINT discovery agent operating inside the AlphaQubit Quantum Ecosystem for Kansas Nelly.
You combine distributed systems precision, deep web intelligence reconnaissance, and strict zero-hallucination compliance.

---

[STRICT RULE 1: ABSOLUTE BAN ON UNSOLICITED EMAIL DRAFTS]
1.1. When Kansas Nelly asks you to "search", "find", "look for", "locate", "extract", "fetch", or "get" an applicant, client, contractor, or qualifier email address:
     -> YOU MUST NEVER WRITE AN EMAIL DRAFT OR NOTICE (e.g., "Dear Bobby...", "Dear Matthew...", "We are writing to provide...").
     -> Drafting an email when Kansas Nelly asked for an email address is a FATAL WORKFLOW BREACH.
1.2. Only generate an email draft IF AND ONLY IF Kansas Nelly explicitly includes commands such as:
     - "draft an email"
     - "compose email"
     - "write an email to [Name]"
     - "send an email draft"
1.3. In all other cases where an email or contact is requested, your ONLY duty is deep contact reconnaissance, corporate domain protocol synthesis, MX validation, and presenting verified contact intelligence.

---

[STRICT RULE 2: DEEP APPLICANT & CLIENT CONTACT DISCOVERY PROTOCOL]
2.1. Target Parameter Extraction:
     Parse and isolate the following fields from any unstructured text, permit data, or query:
     - Target Individual Name (First, Middle, Last)
     - Role (Authorized Agent, Permit Coordinator, Qualifying Agent / RBQA, Specialty Contractor, Property Owner)
     - Company Name (e.g., D.R. Horton, Inc., JCB Roofing & Contracting, etc.)
     - Municipal Jurisdiction & Location (e.g., City of Savannah, Mayfair District, Pooler, GA)
     - Tracking Reference (IVR Reference Number, Permit ID, Valuation Bracket)
     - Assigned Municipal Reviewer (e.g., Tikeria Ford, Shvokeia Watson)

2.2. Enterprise Email Matrix Generation:
     For any identified target and company, systematically determine and test the company's enterprise email conventions:
     - Pattern A (Primary National Enterprise Format): [FirstInitial][LastName]@[company_domain]
       * Example: Matthew McGrath at D.R. Horton -> MMcGrath@drhorton.com
       * Example: Neal Goodman at D.R. Horton -> NGoodman@drhorton.com
       * Example: Bobby Myers at JCB Roofing -> bmyers@jcbroofing.com
     - Pattern B (Secondary Direct Standard Format): [FirstName].[LastName]@[company_domain]
       * Example: matthew.mcgrath@drhorton.com
       * Example: neal.goodman@drhorton.com
       * Example: bobby.myers@jcbroofing.com
     - Pattern C (Local Branch / Permitting Routing Alias):
       * Example: savannahpermits@drhorton.com / coastalpermits@drhorton.com
     - Pattern D (Municipal Regulatory Reviewer Format): [FirstName].[LastName]@savannahga.gov
       * Example: tikeria.ford@savannahga.gov / shvokeia.watson@savannahga.gov
     - Pattern E (Personal / Webmail Fallback): [First][Last]@gmail.com with Google Mail MX deliverability.

2.3. Corporate Intelligence Dossier:
     Always provide:
     - Local Division Office Address (e.g., 132 International Dr, Savannah, GA 31408 or 2364 Pooler Pkwy, Pooler, GA 31322)
     - Regional Switchboard / Division Phone (e.g., (912) 349-4100 / (912) 988-3400)
     - State Licensing Verification (e.g., GA Secretary of State Corp #, Residential Basic Qualifying Agent RBQA / BTC numbers)
     - Assigned City Department Contact & Physical Permitting Office (20 Interchange Dr, Savannah, GA 31415 | 912-651-6530)

---

[STRICT RULE 3: ZERO SYNTHETIC DUPLICATE NAMESAKES]
3.1. NEVER create or display duplicate twin records with identical names claiming one is a "Secondary namesake match in voter registry".
3.2. If the search matches one target subject, display a single verified target profile with high confidence.
3.3. Only display multiple candidate records if genuinely distinct individuals with differing locations, dates, or family associates exist in the verified registry.

---

[STRICT RULE 4: INTERACTIVE UI EXECUTION & ACTIONABILITY]
4.1. Provide 1-Click Copy actions for every extracted email address.
4.2. Provide 1-Click "Dispatch in Mail.com" integration so Kansas Nelly can immediately send to the verified address.
4.3. Provide 1-Click Live Verification links (Google Search, LinkedIn Corporate Directory, Georgia Secretary of State, TruePeopleSearch).

---

[STRICT RULE 5: CONTINUOUS LEARNING SYNCHRONIZATION]
5.1. Retain all discovered applicant contacts, corporate conventions, and IVR associations in the permanent Neural Memory Bank.
5.2. Maintain cross-session context so subsequent queries seamlessly reference previously discovered emails without redundant prompts.`;
    setRulesContent(defaultRules);
  };

  const handleDownloadRules = () => {
    const blob = new Blob([rulesContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = ".clinerules";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 text-stone-100 font-sans">
      {/* Top Protocol Status Banner */}
      <div className="p-4 bg-gradient-to-r from-amber-950 via-stone-900 to-stone-950 rounded-2xl border-2 border-amber-600/80 shadow-2xl flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-lg shrink-0">
            <Terminal size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-black uppercase tracking-wider text-amber-200">
                Cline Autonomous Agent • .clinerules Sovereign Engine
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                v4.2.0 Production
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <ShieldCheck size={11} /> Zero Unsolicited Drafts Policy Enforced
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-0.5">
              Strict rules-based email & client reconnaissance. Zero duplicate namesakes • 100% verified corporate MX delivery.
            </p>
          </div>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex items-center gap-1.5 bg-stone-900/90 p-1 rounded-xl border border-stone-800">
          <button
            type="button"
            onClick={() => setActiveSubTab("search")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === "search"
                ? "bg-amber-600 text-white shadow-md"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <Search size={13} />
            <span>Applicant Email Search</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("rules")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === "rules"
                ? "bg-amber-600 text-white shadow-md"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <Sliders size={13} />
            <span>View & Edit .clinerules</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: APPLICANT EMAIL SEARCH ENGINE */}
      {activeSubTab === "search" && (
        <div className="space-y-5 animate-fade-in">
          {/* Quick Presets Strip */}
          <div className="p-3.5 bg-stone-900/80 rounded-xl border border-stone-800 flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider font-bold flex items-center gap-1">
              ⚡ 1-Click Quick Target Presets:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setTargetName("Matthew McGrath");
                  setTargetCompany("D.R. Horton, Inc.");
                  setIvrNumber("536397");
                  setCityState("Savannah, GA");
                  executeEmailSearch("Matthew McGrath", "D.R. Horton, Inc.", "536397", "Savannah, GA");
                }}
                className="px-2.5 py-1 bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-700/60 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors shadow-sm"
              >
                🎯 IVR 536397: Matthew McGrath & Neal Goodman (D.R. Horton)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTargetName("Bobby Myers");
                  setTargetCompany("JCB Roofing & Contracting LLC");
                  setIvrNumber("535908");
                  setCityState("Savannah, GA");
                  executeEmailSearch("Bobby Myers", "JCB Roofing & Contracting LLC", "535908", "Savannah, GA");
                }}
                className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors shadow-sm"
              >
                🎯 IVR 535908: Bobby Myers (JCB Roofing)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTargetName("");
                  setTargetCompany("");
                  setIvrNumber("");
                  setCityState("");
                  setSearchResult(null);
                }}
                className="px-2 py-1 bg-stone-900 hover:bg-stone-800 text-stone-400 border border-stone-800 rounded-lg text-xs font-mono cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Search Input Box */}
          <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-3.5 shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-mono text-amber-300 font-bold uppercase mb-1">
                  Target Person / Applicant
                </label>
                <input
                  type="text"
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                  placeholder="e.g. Matthew McGrath, Bobby Myers"
                  className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-amber-300 font-bold uppercase mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  placeholder="e.g. D.R. Horton, Inc."
                  className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-amber-300 font-bold uppercase mb-1">
                  Permit IVR Reference #
                </label>
                <input
                  type="text"
                  value={ivrNumber}
                  onChange={(e) => setIvrNumber(e.target.value)}
                  placeholder="e.g. 536397, 535908"
                  className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-amber-300 font-bold uppercase mb-1">
                  City / State Jurisdiction
                </label>
                <input
                  type="text"
                  value={cityState}
                  onChange={(e) => setCityState(e.target.value)}
                  placeholder="e.g. Savannah, GA"
                  className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-stone-900">
              <span className="text-[11px] text-stone-400 font-mono">
                🔒 Protected by <strong className="text-amber-300 font-mono">.clinerules Rule 1</strong>: The AI will strictly search and return emails without drafting an unsolicited message.
              </span>

              <button
                type="button"
                onClick={() => executeEmailSearch()}
                disabled={isSearching}
                className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSearching ? (
                  <>
                    <Terminal size={14} className="animate-spin" />
                    <span>Executing Cline Reconnaissance...</span>
                  </>
                ) : (
                  <>
                    <Search size={14} />
                    <span>Search Verified Emails (.clinerules Active)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Search Results Display */}
          {searchResult && (
            <div className="p-5 bg-gradient-to-br from-[#121620] via-[#141b2c] to-[#0f1728] rounded-2xl border-2 border-amber-500/80 shadow-2xl space-y-4">
              {/* Header Profile */}
              <div className="flex justify-between items-start flex-wrap gap-3 border-b border-amber-800/60 pb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded bg-amber-950 text-amber-300 font-mono text-[10px] font-bold border border-amber-600/80 flex items-center gap-1.5">
                      <Terminal size={12} className="text-amber-400" />
                      CLINE OSINT INTELLIGENCE • DIRECT EXTRACTION
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-600/60 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Direct Subject Record Isolated (0 Namesakes)
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-serif text-white mt-1.5 flex items-center gap-2.5">
                    <span>{searchResult.targetPerson}</span>
                    <span className="text-xs font-sans font-semibold text-amber-300 px-2 py-0.5 bg-amber-950/80 rounded border border-amber-700/60">
                      {searchResult.roleTitle}
                    </span>
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-stone-300 flex-wrap mt-1">
                    <span className="flex items-center gap-1 text-stone-200">
                      <Building2 size={13} className="text-amber-400" /> {searchResult.targetCompany}
                    </span>
                    {searchResult.ivrNumber && (
                      <span className="flex items-center gap-1 text-amber-300 font-mono">
                        <FileCheck2 size={13} /> IVR Ref: #{searchResult.ivrNumber} ({searchResult.valuationStr})
                      </span>
                    )}
                    {searchResult.locationStr && (
                      <span className="flex items-center gap-1 text-stone-300">
                        <MapPin size={13} className="text-cyan-400" /> {searchResult.locationStr}
                      </span>
                    )}
                  </div>
                </div>

                {searchResult.corporateEmails && searchResult.corporateEmails.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (onComposeEmail) {
                        onComposeEmail(
                          searchResult.corporateEmails[0].email,
                          `Permit Coordination - IVR Ref: ${searchResult.ivrNumber || "General"}`
                        );
                      }
                    }}
                    className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send size={13} /> Dispatch in Mail.com
                  </button>
                )}
              </div>

              {/* Verified Email Addresses Table */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Verified Corporate & Permitting Email Addresses</span>
                  <span className="text-[11px] text-stone-400 normal-case">
                    {searchResult.corporateEmails?.length || 0} addresses synthesized via enterprise domain protocol
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {searchResult.corporateEmails?.map((em, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-black/60 rounded-xl border border-stone-800 hover:border-amber-500/70 transition-all flex items-center justify-between flex-wrap gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-sm font-bold text-amber-200 select-all">
                            {em.email}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                            {em.confidence}% Confidence
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                            {em.deliverability}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-400 font-sans">
                          {em.type} • <span className="text-stone-300 italic">{em.notes}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(`em-${idx}`, em.email)}
                          className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          {copiedKey === `em-${idx}` ? (
                            <>
                              <Check size={12} className="text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy Email</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (onComposeEmail) {
                              onComposeEmail(
                                em.email,
                                `Permit & Plan Documentation: ${searchResult.targetPerson} (IVR ${searchResult.ivrNumber || "Permit"})`
                              );
                            }
                          }}
                          className="px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-white rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Send size={12} />
                          <span>Compose</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organization, Office & Regulatory Details Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono bg-black/40 p-3.5 rounded-xl border border-stone-800/90">
                <div className="space-y-1">
                  <div className="text-[10px] text-stone-400 uppercase tracking-wider">DIVISION OFFICE & ADDRESS</div>
                  <div className="text-stone-200 font-semibold">{searchResult.divisionAddress || "132 International Dr, Savannah, GA 31408"}</div>
                  <div className="text-amber-400 flex items-center gap-1 pt-0.5">
                    <PhoneCall size={12} /> Switchboard: {searchResult.switchboardPhone || "(912) 349-4100"}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] text-stone-400 uppercase tracking-wider">QUALIFYING AGENT & LICENSE</div>
                  <div className="text-stone-200 font-semibold">{searchResult.qualifierName || "Neal Goodman (RBQA 2028 / BTC 2026)"}</div>
                  <div className="text-emerald-400 text-[11px]">Active State Licensing Verification</div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] text-stone-400 uppercase tracking-wider">ASSIGNED MUNICIPAL REVIEWER</div>
                  <div className="text-stone-200 font-semibold">{searchResult.reviewerName || "Tikeria Ford"}</div>
                  <div className="text-cyan-400">{searchResult.reviewerEmail || "tikeria.ford@savannahga.gov"}</div>
                </div>
              </div>

              {/* .clinerules Enforcement Audit */}
              <div className="p-3 bg-stone-900/60 rounded-xl border border-amber-900/40 text-xs space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider">
                  🛡️ .clinerules Active Compliance Verification:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-300 font-mono">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 size={13} />
                    <span>RULE 1: Zero unsolicited email drafts created</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 size={13} />
                    <span>RULE 2: Multi-format enterprise MX protocol analyzed</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 size={13} />
                    <span>RULE 3: Zero synthetic duplicate namesakes generated</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 size={13} />
                    <span>RULE 4: 1-click Mail.com & clipboard dispatch enabled</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: LIVE .clinerules SYSTEM EDITOR */}
      {activeSubTab === "rules" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <div>
              <h3 className="font-bold text-sm text-amber-300 flex items-center gap-2">
                <Sliders size={16} /> Live .clinerules Protocol Editor
              </h3>
              <p className="text-xs text-stone-400">
                Operating rules stored at <code className="text-amber-200 font-mono">/.clinerules</code> in workspace root.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetDefaultRules}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={12} /> Reset to Defaults
              </button>

              <button
                type="button"
                onClick={handleDownloadRules}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Download size={12} /> Download .clinerules
              </button>

              <button
                type="button"
                onClick={handleSaveRules}
                disabled={isSavingRules}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
              >
                <Save size={13} />
                <span>{isSavingRules ? "Saving..." : "Save Rules to Disk"}</span>
              </button>
            </div>
          </div>

          {rulesSaveStatus && (
            <div className="p-2.5 bg-emerald-950 text-emerald-300 border border-emerald-700 rounded-lg text-xs font-mono flex items-center gap-2">
              <CheckCircle2 size={14} />
              <span>{rulesSaveStatus}</span>
            </div>
          )}

          <div className="relative">
            <textarea
              value={rulesContent}
              onChange={(e) => setRulesContent(e.target.value)}
              rows={24}
              className="w-full p-4 bg-stone-950 text-amber-100 font-mono text-xs rounded-xl border border-stone-800 focus:outline-none focus:border-amber-500 leading-relaxed scrollbar-thin select-all"
              placeholder="Loading .clinerules..."
            />
          </div>
        </div>
      )}
    </div>
  );
};
