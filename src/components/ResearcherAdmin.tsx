import React, { useState, useEffect } from "react";
import { SurveyResponse } from "../types";
import { Settings, Shield, Plus, Copy, Download, Trash2, X, Check, Save } from "lucide-react";

interface ResearcherAdminProps {
  googleDriveUrl: string;
  onUpdateUrl: (url: string) => void;
  localResponsesCount: number;
  onClearLocal: () => void;
  researcherMode: boolean;
  onToggleResearcherMode: () => void;
  onImportMockData?: () => void;
}

export function ResearcherAdmin({
  googleDriveUrl,
  onUpdateUrl,
  localResponsesCount,
  onClearLocal,
  researcherMode,
  onToggleResearcherMode,
  onImportMockData,
}: ResearcherAdminProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scriptUrl, setScriptUrl] = useState(googleDriveUrl);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);

  useEffect(() => {
    // Load local responses list for diagnostic display
    try {
      const stored = localStorage.getItem("survey_responses_cache");
      if (stored) {
        setResponses(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, [isOpen, localResponsesCount]);

  const handleSaveUrl = () => {
    onUpdateUrl(scriptUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExportCSV = () => {
    if (responses.length === 0) return;

    // Create headers based on request format
    const headers = [
      "ID",
      "Timestamp",
      "Name",
      "Age",
      "Gender",
      "School Type",
      "Siblings",
      "Class",
      "Screen Time",
      // AR1-AR5
      "AR1", "AR2", "AR3", "AR4", "AR5",
      // ER1-ER4
      "ER1", "ER2", "ER3", "ER4",
      // CE1-CE4
      "CE1", "CE2", "CE3", "CE4",
      // CC1-CC4
      "CC1", "CC2", "CC3", "CC4",
      // PD1-PD5
      "PD1", "PD2", "PD3", "PD4", "PD5",
      // PP1-PP5
      "PP1", "PP2", "PP3", "PP4", "PP5",
      // PI1-PI3
      "PI1", "PI2", "PI3"
    ];

    const rows = responses.map((r) => [
      r.id,
      r.submittedAt,
      `"${r.name.replace(/"/g, '""')}"`,
      r.age,
      r.gender,
      r.schoolType,
      r.siblings,
      r.studyingClass,
      r.screenTime,
      r.ratings["AR1"] || "",
      r.ratings["AR2"] || "",
      r.ratings["AR3"] || "",
      r.ratings["AR4"] || "",
      r.ratings["AR5"] || "",
      r.ratings["ER1"] || "",
      r.ratings["ER2"] || "",
      r.ratings["ER3"] || "",
      r.ratings["ER4"] || "",
      r.ratings["CE1"] || "",
      r.ratings["CE2"] || "",
      r.ratings["CE3"] || "",
      r.ratings["CE4"] || "",
      r.ratings["CC1"] || "",
      r.ratings["CC2"] || "",
      r.ratings["CC3"] || "",
      r.ratings["CC4"] || "",
      r.ratings["PD1"] || "",
      r.ratings["PD2"] || "",
      r.ratings["PD3"] || "",
      r.ratings["PD4"] || "",
      r.ratings["PD5"] || "",
      r.ratings["PP1"] || "",
      r.ratings["PP2"] || "",
      r.ratings["PP3"] || "",
      r.ratings["PP4"] || "",
      r.ratings["PP5"] || "",
      r.ratings["PI1"] || "",
      r.ratings["PI2"] || "",
      r.ratings["PI3"] || ""
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Ad_Recall_Survey_Responses_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(responses, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Small floating config gear/button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 bg-white/90 hover:bg-white text-slate-700 p-2.5 rounded-full shadow-lg border border-orange-100 hover:scale-105 transition-all z-40 flex items-center justify-center gap-1.5 cursor-pointer text-xs font-bold"
        title="Researcher Settings"
        id="gear-button"
      >
        <Settings className="w-4 h-4 text-orange-500 animate-spin-slow" />
        <span className="hidden sm:inline">Settings</span>
      </button>

      {/* Admin Panel Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl border-4 border-slate-800 flex flex-col">
            
            {/* Header */}
            <div className="bg-slate-800 p-5 text-white flex justify-between items-center sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-lg">Survey Administrator Panel</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white bg-white/10 p-1.5 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1">
              {/* SCRIPT URL CONFIG */}
              <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-200">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <span>📬 Google Apps Script URL</span>
                </h4>
                <p className="text-xs text-slate-500 mt-1 mb-3">
                  This connects your survey submissions straight to your Google Sheet! 
                  Paste your standard Google Apps Script Web App URL below:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={scriptUrl}
                    onChange={(e) => setScriptUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="flex-1 text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500 font-mono"
                  />
                  <button
                    onClick={handleSaveUrl}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1 transition-all cursor-pointer"
                  >
                    {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                    <span>{saved ? "Saved" : "Save"}</span>
                  </button>
                </div>
                <p className="text-[10px] text-orange-600/80 mt-1 font-semibold leading-relaxed">
                  * Note: If not set, submissions will save locally to the browser's persistent cache.
                </p>
              </div>

              {/* RESEARCHER TESTING MODE SWITCH */}
              <div className="bg-green-50/50 p-4 rounded-2xl border border-green-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-green-900 text-sm">🧪 Enable Tester Shortcuts</h4>
                  <p className="text-xs text-green-700 mt-1 max-w-sm">
                    Unlocks skipping videos and filling random test responses. Extremely useful when demonstrating or testing variables!
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={researcherMode}
                    onChange={onToggleResearcherMode}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              {/* LOCAL DATABASE DIAGNOSTICS & EXPORT */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800 text-sm">
                    📋 Stored Responses ({responses.length} locally)
                  </h4>
                  <div className="flex gap-2">
                    {responses.length > 0 && (
                      <>
                        <button
                          onClick={handleExportCSV}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> Export CSV
                        </button>
                        <button
                          onClick={handleCopyJSON}
                          className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" /> {copied ? "Copied!" : "Copy JSON"}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {responses.length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-xs text-slate-400">
                    No survey responses recorded locally yet. Start a session to capture data!
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-xl overflow-hidden max-h-40 overflow-y-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-100 sticky top-0 font-semibold text-slate-700 border-b border-slate-200">
                        <tr>
                          <th className="p-2">Name</th>
                          <th className="p-2">Age / Gender</th>
                          <th className="p-2">Class</th>
                          <th className="p-2">Answers</th>
                          <th className="p-2 text-right">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600 bg-white">
                        {responses.map((resp) => {
                          const ansCount = Object.keys(resp.ratings || {}).length;
                          return (
                            <tr key={resp.id} className="hover:bg-slate-50/50">
                              <td className="p-2 font-bold max-w-[120px] truncate">{resp.name}</td>
                              <td className="p-2">{resp.age}yo / {resp.gender}</td>
                              <td className="p-2">{resp.studyingClass}</td>
                              <td className="p-2 font-medium text-amber-600">{ansCount} items</td>
                              <td className="p-2 text-right text-[10px] text-gray-400">
                                {new Date(resp.submittedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* EMERGENCY DELETION */}
              <div className="flex justify-between items-center border-t border-slate-100 pt-5 pr-2">
                {onImportMockData && (
                  <button
                    onClick={onImportMockData}
                    className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-orange-600 font-bold transition-all bg-slate-50 border border-slate-200 hover:bg-orange-50 px-3 py-1.5 rounded-lg cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Pop 3 Sample Responses
                  </button>
                )}
                {responses.length > 0 && (
                  <button
                    onClick={onClearLocal}
                    className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold py-1.5 px-3 rounded-lg border border-red-200 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Total Delete Local DB
                  </button>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-100 text-center text-[10px] text-slate-400 font-medium border-t border-slate-200">
              Survey Researcher System &bull; Secured locally under standard LocalStorage protocols
            </div>
          </div>
        </div>
      )}
    </>
  );
}
