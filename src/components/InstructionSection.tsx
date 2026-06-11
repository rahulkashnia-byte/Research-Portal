import React from "react";
import { Film, Eye, Sparkles, AlertCircle, ArrowRight } from "lucide-react";

interface InstructionSectionProps {
  participantName: string;
  onNext: () => void;
}

export function InstructionSection({ participantName, onNext }: InstructionSectionProps) {
  return (
    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
      
      {/* Brand style Header */}
      <div className="bg-orange-500 p-6 md:p-8 text-white relative text-center">
        <h2 className="text-2xl md:text-3xl font-bold font-sans tracking-tight uppercase">
          Welcome, {participantName || "Participant"}! 🙌
        </h2>
        <p className="text-orange-100 text-sm mt-1.5 font-medium">
          Please review the following session parameters carefully:
        </p>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        
        {/* Sleek partitioned steps */}
        <div className="space-y-4">
          
          {/* Step 1 */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-150">
            <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              1
            </span>
            <div className="space-y-1">
              <h4 className="text-sm uppercase font-extrabold text-slate-800 flex items-center gap-1.5">
                <Film className="w-4 h-4 text-orange-500" /> Watch Advertisements
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                You will watch <strong className="text-slate-800">4 short target advertisements</strong> sequentially. Each ad highlights a unique category.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-150">
            <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              2
            </span>
            <div className="space-y-1">
              <h4 className="text-sm uppercase font-extrabold text-slate-800 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-orange-500" /> Observe Closely
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Observe characters, brand labels, visual colors, and slogans carefully to prepare for the recollection phase.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-150">
            <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              3
            </span>
            <div className="space-y-1">
              <h4 className="text-sm uppercase font-extrabold text-slate-800 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-orange-500" /> Unified Questionnaire
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                All attitude scale statements will appear <strong className="text-slate-800">after playing all videos</strong>. Playback contains no survey task interruptions.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-150">
            <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              4
            </span>
            <div className="space-y-1">
              <h4 className="text-sm uppercase font-extrabold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-orange-500" /> Objective Feedback
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                There are absolutely no right or wrong answers. Choose standard scale choices representing your genuine assessment.
              </p>
            </div>
          </div>

        </div>

        {/* Start button */}
        <button
          onClick={onNext}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-4 px-6 rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <span>Begin Video Exploration</span> <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
