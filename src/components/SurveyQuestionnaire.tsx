import React, { useState } from "react";
import { Question, SURVEY_QUESTIONS, LIKERT_SCALE } from "../types";
import { ChevronLeft, HelpCircle } from "lucide-react";

interface SurveyQuestionnaireProps {
  answers: Record<string, number>;
  onAnswer: (questionId: string, rating: number) => void;
  onSubmit: () => void;
}

export function SurveyQuestionnaire({ answers, onAnswer, onSubmit }: SurveyQuestionnaireProps) {
  const [currentIdx, setCurrentIdx] = useState(0);

  const activeQuestion = SURVEY_QUESTIONS[currentIdx];
  const totalQuestions = SURVEY_QUESTIONS.length;
  const currentAnswer = answers[activeQuestion.id];

  const handleRatingSelect = (val: number) => {
    onAnswer(activeQuestion.id, val);
    // Smooth auto-advance delay
    setTimeout(() => {
      if (currentIdx < totalQuestions - 1) {
        setCurrentIdx((prev) => prev + 1);
      }
    }, 320);
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const percentCompleted = Math.round((answeredCount / totalQuestions) * 100);
  const allAnswered = answeredCount >= totalQuestions;

  // Custom styling mappings to handle clean borders and hovers based on option indexes
  const ratingConfigs: Record<number, { hoverClasses: string; activeClasses: string; labelColor: string }> = {
    1: {
      hoverClasses: "group-hover:border-red-400 group-hover:bg-red-50 group-hover:text-red-500",
      activeClasses: "border-red-500 bg-red-100 text-red-600 ring-4 ring-red-50",
      labelColor: "text-red-600",
    },
    2: {
      hoverClasses: "group-hover:border-orange-400 group-hover:bg-orange-50 group-hover:text-orange-500",
      activeClasses: "border-orange-500 bg-orange-100 text-orange-600 ring-4 ring-orange-50",
      labelColor: "text-orange-600",
    },
    3: {
      hoverClasses: "group-hover:border-blue-400 group-hover:bg-blue-50 group-hover:text-blue-500",
      activeClasses: "border-blue-500 bg-blue-100 text-blue-600 ring-4 ring-blue-50",
      labelColor: "text-blue-600",
    },
    4: {
      hoverClasses: "group-hover:border-emerald-500 group-hover:bg-emerald-50 group-hover:text-emerald-600",
      activeClasses: "border-emerald-500 bg-emerald-55 text-emerald-600 ring-4 ring-emerald-100 scale-102",
      labelColor: "text-emerald-600 font-black",
    },
    5: {
      hoverClasses: "group-hover:border-green-600 group-hover:bg-green-50 group-hover:text-green-700",
      activeClasses: "border-green-600 bg-green-100 text-green-700 ring-4 ring-green-100 scale-102",
      labelColor: "text-green-700 font-extrabold",
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col border border-slate-200">
      
      {/* Header Info Block */}
      <div className="bg-slate-50 p-6 md:p-8 border-b border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {activeQuestion.id} / {activeQuestion.category.split(" (")[0]}
            </span>
            <span className="text-xl">{activeQuestion.categoryEmoji}</span>
          </div>
          <span className="text-slate-400 text-sm font-medium">
            Question {currentIdx + 1} of {totalQuestions}
          </span>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 leading-tight">
          &ldquo;{activeQuestion.text}&rdquo;
        </h2>
      </div>

      {/* Likert Scale 5-Column Grid */}
      <div className="p-6 md:p-12 flex-1 flex flex-col justify-center">
        <p className="text-center text-slate-400 text-xs md:text-sm mb-6 md:mb-8 font-medium italic">
          Please select how you feel about the statement above:
        </p>

        <div className="grid grid-cols-5 gap-2 sm:gap-4 md:gap-6">
          {LIKERT_SCALE.map((opt) => {
            const isActive = currentAnswer === opt.value;
            const styleConf = ratingConfigs[opt.value];

            return (
              <button
                type="button"
                key={opt.value}
                onClick={() => handleRatingSelect(opt.value)}
                className="group flex flex-col items-center gap-3 transition-all outline-none cursor-pointer"
              >
                {/* Visual Circle Box */}
                <div
                  className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl border-4 text-lg sm:text-2xl font-bold flex flex-col items-center justify-center transition-all duration-200 shadow-xs ${
                    isActive
                      ? styleConf.activeClasses
                      : `border-slate-100 text-slate-400 bg-white ${styleConf.hoverClasses}`
                  }`}
                >
                  {/* Subtle Emoji on secondary row or just pure rating digit */}
                  <span>{opt.value}</span>
                  <span className="text-[10px] sm:text-xs md:text-sm mt-[-2px] filter grayscale-40 group-hover:grayscale-0">
                    {opt.emoji}
                  </span>
                </div>

                {/* Subtext explanation in upper caps */}
                <span
                  className={`text-[9px] sm:text-[10px] md:text-xs font-bold uppercase text-center tracking-tighter leading-tight transition-colors ${
                    isActive
                      ? styleConf.labelColor
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}
                >
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Progress visual separator */}
      <div className="w-full bg-slate-100 h-1 relative overflow-hidden">
        <div
          className="bg-orange-500 h-full transition-all duration-300"
          style={{ width: `${percentCompleted}%` }}
        />
      </div>

      {/* Action Footer */}
      <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-between items-center flex-wrap gap-4">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className={`px-6 md:px-8 py-3 rounded-xl border font-bold transition-all text-xs md:text-sm cursor-pointer select-none leading-none ${
            currentIdx === 0
              ? "border-slate-200 text-slate-300 pointer-events-none"
              : "border-slate-300 text-slate-500 hover:bg-slate-100 active:scale-97"
          }`}
        >
          Previous
        </button>

        {/* Progress tracker info */}
        <div className="text-center text-[10px] md:text-xs uppercase font-extrabold tracking-wider text-slate-400">
          <span>PROGRESS: {percentCompleted}% ({answeredCount}/{totalQuestions} Answered)</span>
          {allAnswered && <span className="block text-emerald-600 mt-0.5">All Items Ready! ✅</span>}
        </div>

        {/* Next / Submit Button */}
        {currentIdx === totalQuestions - 1 ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!allAnswered}
            className={`px-8 md:px-12 py-3.5 rounded-xl font-bold shadow-lg transition-all text-xs md:text-sm cursor-pointer ${
              allAnswered
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-250 hover:shadow-xl hover:scale-102 active:scale-95"
                : "bg-slate-300 text-white pointer-events-none"
            }`}
          >
            Submit Survey
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="px-8 md:px-12 py-3.5 rounded-xl bg-orange-500 text-white font-bold shadow-lg shadow-orange-150 hover:bg-orange-600 active:scale-95 transition-all text-xs md:text-sm cursor-pointer"
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
}
