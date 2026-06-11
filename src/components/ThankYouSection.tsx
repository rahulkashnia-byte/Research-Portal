import React from "react";
import { Check, Star, RefreshCw } from "lucide-react";

interface ThankYouSectionProps {
  participantName: string;
  isOnlineSaved: boolean;
  onReset: () => void;
  ratingsCount: number;
}

export function ThankYouSection({ participantName, isOnlineSaved, onReset, ratingsCount }: ThankYouSectionProps) {
  return (
    <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 p-6 md:p-10 flex flex-col items-center space-y-6 text-center">
      
      {/* Decorative success vector token */}
      <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-200 shadow-xs">
        <Check className="w-8 h-8 font-extrabold" />
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-bold font-sans tracking-tight text-slate-800 uppercase">
          Thank you! 🎉
        </h2>
        <p className="text-slate-600 text-sm font-medium max-w-md">
          Congratulations <strong>{participantName || "Participant"}</strong>, your responses have been processed and saved successfully.
        </p>
      </div>

      {/* Structured metrics status panel */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 w-full max-w-sm text-left divide-y divide-slate-150">
        <div className="pb-2.5 flex justify-between items-center text-xs font-semibold">
          <span className="text-slate-500 uppercase tracking-wider">Completed Items:</span>
          <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
            {ratingsCount} / 26 Answered
          </span>
        </div>
        <div className="pt-2.5 flex justify-between items-center text-xs font-semibold">
          <span className="text-slate-500 uppercase tracking-wider">Sync Destination:</span>
          {isOnlineSaved ? (
            <span className="text-blue-700 font-bold bg-blue-50 border border-blue-150 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              Google Sheets Online
            </span>
          ) : (
            <span className="text-orange-700 font-bold bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              Secure Local Cache
            </span>
          )}
        </div>
      </div>

      {/* Virtual token/badge for clean child feedback */}
      <div className="flex flex-col items-center bg-slate-50/50 p-4 rounded-xl border border-dotted border-slate-200 w-full max-w-xs">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">SOCIOLOGY LAB PORTAL</span>
        <span className="font-bold text-slate-700 mt-1 text-sm">Session Badge: Junior Researcher</span>
        <div className="flex gap-1 mt-2.5">
          <Star className="w-5 h-5 text-amber-400 fill-current" />
          <Star className="w-5 h-5 text-amber-400 fill-current" />
          <Star className="w-5 h-5 text-amber-400 fill-current" />
        </div>
      </div>

      <p className="text-xs text-slate-400 max-w-xs leading-relaxed select-none">
        You may now safely close this window, or pass the device back to the academic supervisor to cycle for the next participant.
      </p>

      {/* Cycle Action */}
      <div className="pt-2">
        <button
          onClick={onReset}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all cursor-pointer text-xs uppercase tracking-wider active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Next Participant (Reset)</span>
        </button>
      </div>
    </div>
  );
}
