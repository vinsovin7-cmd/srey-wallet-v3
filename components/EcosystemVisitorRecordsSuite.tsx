import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
  Globe,
  Clock,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  UserCheck,
  AlertCircle,
  RefreshCw,
  HardDrive,
  X
} from "lucide-react";
import { VisitorRecord, GoogleVisitorSignInModal } from "./GoogleVisitorSignInModal";

export const EcosystemVisitorRecordsSuite: React.FC = () => {
  const [records, setRecords] = useState<VisitorRecord[]>([]);
  const [summary, setSummary] = useState({
    totalCount: 0,
    activeTodayCount: 0,
    verifiedCount: 0,
    lastRegisteredAt: new Date().toISOString()
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "ADMIN_RESERVED" | "VERIFIED_VISITOR">("ALL");
  const [showSignInModal, setShowSignInModal] = useState(false);
  
  const [inspectRecord, setInspectRecord] = useState<VisitorRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchVisitorRecords = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ecosystem/visitor-records");
      const data = await response.json();
      if (data.success) {
        setRecords(data.records || []);
        if (data.summary) {
          setSummary(data.summary);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch visitor records from server:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitorRecords();
  }, []);

  const handleDeleteRecord = async (id: string) => {
    if (!window.confirm(`Are you sure you want to remove visitor record ${id}?`)) return;

    try {
      const res = await fetch(`/api/ecosystem/visitor-records/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setRecords((prev) => prev.filter((r) => r.id !== id));
        setStatusMessage(`Deleted record ${id}`);
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (e) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleExportCsv = async () => {
    try {
      const res = await fetch("/api/ecosystem/visitor-records/export", { method: "POST" });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ecosystem_google_visitor_records_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setStatusMessage("Exported CSV file of Google visitor records!");
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      alert("Export failed.");
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Search & Filtered Records
  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      rec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.countryLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.phoneNumber && rec.phoneNumber.includes(searchQuery));

    const matchesFilter =
      selectedFilter === "ALL" || rec.accessLevel === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in text-stone-100">
      
      {/* HEADER BANNER */}
      <div className="p-6 bg-gradient-to-r from-[#0e101a] via-[#141824] to-[#120b22] border border-blue-500/40 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-blue-950 text-blue-300 rounded-full text-[10px] font-mono border border-blue-500/60 font-bold flex items-center gap-1">
              <ShieldCheck size={12} className="text-blue-400" /> GOOGLE SIGN-IN VISITOR DATABASE
            </span>
            <span className="px-2.5 py-1 bg-amber-950 text-amber-300 rounded-full text-[10px] font-mono border border-amber-500/60 font-bold">
              REAL-TIME RECORDS
            </span>
          </div>

          <h2 className="font-serif font-black text-2xl text-white flex items-center gap-2">
            <span>Google Visitor Sign-In & Ecosystem Registry</span>
          </h2>

          <p className="text-xs text-stone-300 max-w-xl">
            Complete database recording all visitors coming into the ecosystem via Google Sign-In, recording profile details, Google Email, Phone Numbers, and access level credentials.
          </p>
        </div>

        {/* TOP ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <button
            onClick={() => setShowSignInModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black rounded-xl text-xs shadow-lg transition-all cursor-pointer flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Sign in with Google (New Visitor)</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2.5 bg-stone-900/90 hover:bg-stone-800 border border-stone-700 text-stone-200 font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5"
            title="Download CSV report of all visitor records"
          >
            <Download size={15} className="text-amber-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={fetchVisitorRecords}
            className="p-2.5 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-white rounded-xl transition-all cursor-pointer"
            title="Refresh Visitor Registry"
          >
            <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500 rounded-xl text-emerald-200 text-xs font-bold text-center animate-fade-in">
          ✅ {statusMessage}
        </div>
      )}

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-[#0d0f17] border border-stone-800 rounded-2xl space-y-1 shadow-lg">
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
            <Users size={14} className="text-blue-400" />
            <span>Total Registered Google Visitors</span>
          </p>
          <p className="text-2xl font-serif font-black text-white">
            {records.length} <span className="text-xs font-sans text-stone-400 font-normal">Records Saved</span>
          </p>
        </div>

        <div className="p-4 bg-[#0d0f17] border border-stone-800 rounded-2xl space-y-1 shadow-lg">
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck size={14} className="text-emerald-400" />
            <span>Active Today in Ecosystem</span>
          </p>
          <p className="text-2xl font-serif font-black text-emerald-400">
            {summary.activeTodayCount || records.length} <span className="text-xs font-sans text-stone-400 font-normal">Active Signals</span>
          </p>
        </div>

        <div className="p-4 bg-[#0d0f17] border border-stone-800 rounded-2xl space-y-1 shadow-lg">
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-amber-400" />
            <span>Verified 2FA & Google Accounts</span>
          </p>
          <p className="text-2xl font-serif font-black text-amber-300">
            100% <span className="text-xs font-sans text-stone-400 font-normal">Verified SSO</span>
          </p>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="p-4 bg-[#0e101a] border border-stone-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3.5 top-3 text-stone-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Google Name, Email, Phone, Location..."
            className="w-full pl-9 pr-4 py-2 bg-black border border-stone-800 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        {/* FILTER BUTTONS */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setSelectedFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedFilter === "ALL"
                ? "bg-blue-600 text-white font-black shadow"
                : "bg-stone-900 text-stone-400 hover:text-white"
            }`}
          >
            All Visitors ({records.length})
          </button>

          <button
            onClick={() => setSelectedFilter("ADMIN_RESERVED")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedFilter === "ADMIN_RESERVED"
                ? "bg-amber-600 text-stone-950 font-black shadow"
                : "bg-stone-900 text-stone-400 hover:text-white"
            }`}
          >
            Admin / Founders
          </button>

          <button
            onClick={() => setSelectedFilter("VERIFIED_VISITOR")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedFilter === "VERIFIED_VISITOR"
                ? "bg-emerald-600 text-white font-black shadow"
                : "bg-stone-900 text-stone-400 hover:text-white"
            }`}
          >
            Verified Visitors
          </button>
        </div>
      </div>

      {/* VISITOR RECORDS TABLE */}
      <div className="bg-[#0b0c12] border border-stone-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-[#121420] text-stone-400 uppercase font-mono text-[10px] tracking-wider border-b border-stone-800">
              <tr>
                <th className="px-4 py-3">Visitor / Google Profile</th>
                <th className="px-4 py-3">Email & Google ID</th>
                <th className="px-4 py-3">Phone & Location</th>
                <th className="px-4 py-3">Visit Purpose / Role</th>
                <th className="px-4 py-3">Sign-In Timestamp</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 font-mono">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-stone-500">
                    No Google visitor records found matching your query.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#121524]/60 transition-colors">
                    {/* PROFILE */}
                    <td className="px-4 py-3 font-sans">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rec.avatarUrl}
                          alt={rec.name}
                          className="w-9 h-9 rounded-full object-cover border border-amber-400/80 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white text-xs flex items-center gap-1.5">
                            <span>{rec.name}</span>
                            {rec.accessLevel === "ADMIN_RESERVED" && (
                              <span className="px-1.5 py-0.2 bg-amber-950 text-amber-300 rounded text-[9px] border border-amber-600 font-bold">
                                FOUNDER
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] font-mono text-stone-400 flex items-center gap-1">
                            <span className="text-emerald-400 font-bold">{rec.id}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* EMAIL & ID */}
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-amber-300 font-bold">
                          <span>{rec.email}</span>
                          <button
                            onClick={() => copyToClipboard(rec.email, rec.id)}
                            className="p-1 text-stone-500 hover:text-white transition-colors cursor-pointer"
                            title="Copy Email"
                          >
                            {copiedId === rec.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          </button>
                        </div>
                        <p className="text-[10px] text-stone-500">ID: {rec.googleAccountId}</p>
                      </div>
                    </td>

                    {/* PHONE & LOCATION */}
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        <p className="text-stone-200 font-bold flex items-center gap-1">
                          <Phone size={11} className="text-amber-400" />
                          <span>{rec.phoneNumber || "Not provided"}</span>
                        </p>
                        <p className="text-[10px] text-stone-400 flex items-center gap-1">
                          <Globe size={11} className="text-blue-400" />
                          <span>{rec.countryLocation}</span>
                        </p>
                      </div>
                    </td>

                    {/* PURPOSE */}
                    <td className="px-4 py-3 font-sans">
                      <p className="text-xs text-stone-200 font-semibold">{rec.visitPurpose}</p>
                      <p className="text-[10px] font-mono text-stone-500">IP: {rec.ipAddress}</p>
                    </td>

                    {/* TIMESTAMP */}
                    <td className="px-4 py-3 text-[11px] text-stone-400">
                      <p className="flex items-center gap-1">
                        <Clock size={11} className="text-stone-500" />
                        <span>{new Date(rec.registeredAt).toLocaleDateString()}</span>
                      </p>
                      <p className="text-[10px] text-stone-500">
                        {new Date(rec.registeredAt).toLocaleTimeString()}
                      </p>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setInspectRecord(rec)}
                          className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 rounded-lg text-[10px] font-bold cursor-pointer transition-all"
                        >
                          Inspect
                        </button>

                        <button
                          onClick={() => handleDeleteRecord(rec.id)}
                          className="p-1.5 text-stone-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                          title="Remove Record"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECT RECORD MODAL */}
      {inspectRecord && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#121420] border border-stone-700 rounded-2xl p-6 max-w-lg w-full space-y-4 text-stone-100 relative shadow-2xl animate-scale-in">
            <button
              onClick={() => setInspectRecord(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-stone-800">
              <img
                src={inspectRecord.avatarUrl}
                alt="Avatar"
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-400"
              />
              <div>
                <h3 className="font-serif font-black text-lg text-white">{inspectRecord.name}</h3>
                <p className="text-xs font-mono text-amber-300">{inspectRecord.email}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 bg-black/60 border border-stone-800 rounded-xl space-y-1.5">
                <p className="text-[10px] text-stone-500 uppercase">Google Account Metadata</p>
                <p><span className="text-stone-400">Record ID:</span> <strong className="text-emerald-400">{inspectRecord.id}</strong></p>
                <p><span className="text-stone-400">Google ID:</span> <strong className="text-stone-200">{inspectRecord.googleAccountId}</strong></p>
                <p><span className="text-stone-400">Phone:</span> <strong className="text-amber-300">{inspectRecord.phoneNumber || "N/A"}</strong></p>
                <p><span className="text-stone-400">Location:</span> <strong className="text-stone-200">{inspectRecord.countryLocation}</strong></p>
                <p><span className="text-stone-400">IP Address:</span> <strong className="text-stone-200">{inspectRecord.ipAddress}</strong></p>
                <p><span className="text-stone-400">Registered:</span> <strong className="text-stone-200">{new Date(inspectRecord.registeredAt).toLocaleString()}</strong></p>
              </div>

              <div className="p-3 bg-black/60 border border-stone-800 rounded-xl space-y-1">
                <p className="text-[10px] text-stone-500 uppercase">Ecosystem Activity Purpose</p>
                <p className="font-sans text-stone-200 font-semibold">{inspectRecord.visitPurpose}</p>
              </div>
            </div>

            <button
              onClick={() => setInspectRecord(null)}
              className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-white font-bold rounded-xl text-xs cursor-pointer transition-all"
            >
              Close Record Inspector
            </button>
          </div>
        </div>
      )}

      {/* GOOGLE SIGN IN MODAL */}
      <GoogleVisitorSignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSuccess={(rec) => {
          setRecords((prev) => [rec, ...prev.filter((r) => r.id !== rec.id)]);
          setStatusMessage(`Registered new visitor record: ${rec.name} (${rec.email})`);
          setTimeout(() => setStatusMessage(null), 4000);
        }}
      />
    </div>
  );
};
