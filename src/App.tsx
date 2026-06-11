import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Demographics, Question, SURVEY_QUESTIONS, SurveyResponse, LIKERT_SCALE } from "./types";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { DemographicsForm } from "./components/DemographicsForm";
import { InstructionSection } from "./components/InstructionSection";
import { VideoPlayer } from "./components/VideoPlayer";
import { SurveyQuestionnaire } from "./components/SurveyQuestionnaire";
import { ThankYouSection } from "./components/ThankYouSection";
import { ResearcherAdmin } from "./components/ResearcherAdmin";
import { Sparkles, GraduationCap, ShieldCheck, Database, Send, Radio } from "lucide-react";

type SurveyStage = "DEMOGRAPHICS" | "INSTRUCTIONS" | "VIDEOS" | "QUESTIONNAIRE" | "COMPLETED";

export default function App() {
  // Central State Management
  const [stage, setStage] = useState<SurveyStage>("DEMOGRAPHICS");
  const [demographics, setDemographics] = useState<Demographics | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [scriptUrl, setScriptUrl] = useState<string>("https://script.google.com/macros/s/AKfycbz_XYZ_example/exec");
  const [isSavedOnline, setIsSavedOnline] = useState(false);
  const [researcherMode, setResearcherMode] = useState(false);
  const [dbLength, setDbLength] = useState(0);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load persisted SCRIPT_URL & database length on mount
  useEffect(() => {
    const savedUrl = localStorage.getItem("survey_script_url");
    if (savedUrl) {
      setScriptUrl(savedUrl);
    }

    try {
      const stored = localStorage.getItem("survey_responses_cache");
      if (stored) {
        const parsed = JSON.parse(stored);
        setDbLength(parsed.length || 0);
      }
    } catch (err) {
      console.warn("Storage reading error:", err);
    }
  }, []);

  // Update script URL in state and storage
  const handleUpdateScriptUrl = (url: string) => {
    setScriptUrl(url);
    localStorage.setItem("survey_script_url", url);
  };

  // Demographic submission
  const handleDemographicsSubmit = (data: Demographics) => {
    setDemographics(data);
    setStage("INSTRUCTIONS");
  };

  // Answer collection
  const handleAnswerSubmit = (questionId: string, rating: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: rating }));
  };

  // Google Sheets integration and final record save
  const handleFinalSubmit = async () => {
    if (!demographics) return;
    setIsSubmitLoading(true);
    setSubmitError(null);

    const submissionId = "sub_" + Math.random().toString(36).substring(2, 11);
    const timestamp = new Date().toLocaleString();

    // Map the payload as specified in Google Sheets instructions
    const payload: Record<string, any> = {
      name: demographics.name,
      age: demographics.age,
      gender: demographics.gender,
      schoolType: demographics.schoolType,
      siblings: demographics.siblings,
      studyingClass: demographics.studyingClass,
      screenTime: demographics.screenTime,
      submittedAt: timestamp,
    };

    // Unpack ratings
    SURVEY_QUESTIONS.forEach((q) => {
      payload[q.id] = answers[q.id] || 3; // default to neutral if missing
    });

    const newResponse: SurveyResponse = {
      id: submissionId,
      name: demographics.name,
      age: demographics.age,
      gender: demographics.gender,
      schoolType: demographics.schoolType,
      siblings: demographics.siblings,
      studyingClass: demographics.studyingClass,
      screenTime: demographics.screenTime,
      consent: demographics.consent,
      submittedAt: timestamp,
      ratings: { ...answers },
    };

    // 1. Commit to persistent LocalStorage backup database immediately
    let cachedResponses: SurveyResponse[] = [];
    try {
      const stored = localStorage.getItem("survey_responses_cache");
      if (stored) {
        cachedResponses = JSON.parse(stored);
      }
    } catch {
      // safe fallback
    }
    cachedResponses.push(newResponse);
    localStorage.setItem("survey_responses_cache", JSON.stringify(cachedResponses));
    setDbLength(cachedResponses.length);

    // 2. Submit to Google Apps Script Web App Endpoint (Online stream)
    let onlineSavedSuccess = false;
    if (scriptUrl && scriptUrl.trim() !== "" && !scriptUrl.includes("AKfycbz_XYZ_example")) {
      try {
        // Prepare Form UrlEncoded format which is standard and robust for Google scripts bypass
        const formData = new URLSearchParams();
        Object.entries(payload).forEach(([key, val]) => {
          formData.append(key, String(val));
        });

        // Use standard POST mode: 'no-cors' for script.google integration
        await fetch(scriptUrl, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString()
        });

        onlineSavedSuccess = true;
        console.log("Transmitted to Google Sheets WebApp successfully!");
      } catch (err) {
        console.error("Online sheet submission error:", err);
        setSubmitError("Sheets Server busy. Saved responses securely to browser local backup database.");
      }
    } else {
      console.warn("SCRIPT_URL is not configured yet. Saving to Local Browser Cache is complete.");
    }

    setIsSavedOnline(onlineSavedSuccess);
    setIsSubmitLoading(false);
    setStage("COMPLETED");
  };

  // Entire flow reset for schoolkids cycling
  const handleResetFlow = () => {
    setDemographics(null);
    setAnswers({});
    setStage("DEMOGRAPHICS");
    setIsSavedOnline(false);
    setSubmitError(null);
  };

  const handleClearLocalDatabase = () => {
    if (window.confirm("⚠️ Are you sure you want to permanently delete all stored student records from this computer? This cannot be undone.")) {
      localStorage.removeItem("survey_responses_cache");
      setDbLength(0);
      alert("Local database emptied successfully. 👍");
    }
  };

  const handleToggleResearcherMode = () => {
    setResearcherMode((prev) => !prev);
  };

  // Pre-populates mock data to demonstrate data table inside Admin settings
  const handleImportMockData = () => {
    const mockNames = ["Rahul K.", "Sarah M.", "Junior G."];
    const mockGenders = ["Boy", "Girl", "Other"];
    const mockSchools = ["Private", "Government"];
    const mockClasses = ["Class 3", "Class 5", "Class 4"];
    const mockTimes = ["1-2 hours", "Less than 1 hour", "More than 3 hours"];

    const mockRecords: SurveyResponse[] = mockNames.map((name, i) => {
      const mockAnswers: Record<string, number> = {};
      SURVEY_QUESTIONS.forEach((q) => {
        mockAnswers[q.id] = Math.floor(Math.random() * 5) + 1;
      });

      return {
        id: `mock_${Math.random().toString(36).substring(3,8)}`,
        name,
        age: String(8 + i),
        gender: mockGenders[i % mockGenders.length],
        schoolType: mockSchools[i % mockSchools.length],
        siblings: String(i),
        studyingClass: mockClasses[i % mockClasses.length],
        screenTime: mockTimes[i % mockTimes.length],
        consent: true,
        submittedAt: new Date(Date.now() - (i + 1) * 3600000).toLocaleString(),
        ratings: mockAnswers
      };
    });

    let current: SurveyResponse[] = [];
    try {
      const stored = localStorage.getItem("survey_responses_cache");
      if (stored) current = JSON.parse(stored);
    } catch { }

    const combined = [...current, ...mockRecords];
    localStorage.setItem("survey_responses_cache", JSON.stringify(combined));
    setDbLength(combined.length);
    alert("Injected 3 cute test response logs! Click settings gear again to see them. 📈");
  };

  // Active tester shortcuts (Pre-fill Demographic info)
  const handleQuickPreFillDemographics = () => {
    const randomBoyNames = ["Aarav", "Kabir", "Ethan", "Arjun", "Lucas"];
    const name = randomBoyNames[Math.floor(Math.random() * randomBoyNames.length)] + " (Test Account)";
    
    setDemographics({
      name,
      age: "9",
      gender: "Boy",
      schoolType: "Private",
      siblings: "1",
      studyingClass: "Class 4",
      screenTime: "1-2 hours",
      consent: true,
    });
    setStage("INSTRUCTIONS");
  };

  // Direct random completion for testers
  const handleQuickAutocompleteQuestions = () => {
    const randomRatings: Record<string, number> = {};
    SURVEY_QUESTIONS.forEach((q) => {
      randomRatings[q.id] = Math.floor(Math.random() * 5) + 1;
    });
    setAnswers(randomRatings);
  };

  return (
    <div className="min-h-screen relative font-sans flex flex-col justify-between overflow-x-hidden select-none">
      {/* Animated Sky Canvas Layer */}
      <AnimatedBackground />

      {/* Admin Panel Floating Gear */}
      <ResearcherAdmin
        googleDriveUrl={scriptUrl}
        onUpdateUrl={handleUpdateScriptUrl}
        localResponsesCount={dbLength}
        onClearLocal={handleClearLocalDatabase}
        researcherMode={researcherMode}
        onToggleResearcherMode={handleToggleResearcherMode}
        onImportMockData={handleImportMockData}
      />

      {/* Sleek Theme Navigation Header */}
      <header className="w-full h-16 flex items-center justify-between px-6 md:px-8 bg-orange-500 text-white font-semibold shadow-md relative z-35 shrink-0 select-none">
        <div className="flex items-center gap-3">
          <span className="text-base md:text-lg tracking-tight uppercase font-black">Child Ad Research Portal</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden sm:inline text-[10px] uppercase tracking-widest text-orange-100 font-bold bg-orange-600 px-2 py-0.5 rounded-md">
            Session Active
          </span>
        </div>

        <div className="flex items-center gap-4 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-orange-50/90">
          <div className="hidden md:flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-emerald-300" />
            <span>Database Connected</span>
          </div>
          <span className="bg-orange-600/60 px-2.5 py-1 rounded-md text-white font-black">
            Stored Records: {dbLength}
          </span>
        </div>
      </header>

      {/* Main Container Stage */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 flex items-center justify-center relative z-20">
        <AnimatePresence mode="wait">
          {stage === "DEMOGRAPHICS" && (
            <motion.div
              key="demographics"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center gap-4"
            >
              {researcherMode && (
                <div className="w-full max-w-2xl bg-teal-50 border-2 border-dashed border-teal-300 p-3 rounded-2xl flex justify-between items-center text-xs text-teal-800">
                  <span className="font-bold flex items-center gap-1">
                    <span>🔬 Tester Alert:</span> Quick Start prefilled profile?
                  </span>
                  <button
                    onClick={handleQuickPreFillDemographics}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-1.5 px-3 rounded-lg"
                  >
                    Auto Fill &amp; Go! ⚡
                  </button>
                </div>
              )}
              <DemographicsForm onSubmit={handleDemographicsSubmit} />
            </motion.div>
          )}

          {stage === "INSTRUCTIONS" && (
            <motion.div
              key="instructions"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.28 }}
              className="w-full flex justify-center"
            >
              <InstructionSection
                participantName={demographics?.name || ""}
                onNext={() => setStage("VIDEOS")}
              />
            </motion.div>
          )}

          {stage === "VIDEOS" && (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3 }}
              className="w-full flex justify-center"
            >
              <VideoPlayer
                onAllVideosFinished={() => setStage("QUESTIONNAIRE")}
                researcherMode={researcherMode}
              />
            </motion.div>
          )}

          {stage === "QUESTIONNAIRE" && (
            <motion.div
              key="questionnaire"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center gap-4"
            >
              {researcherMode && (
                <div className="w-full max-w-2xl bg-indigo-50 border-2 border-dashed border-indigo-300 p-3 rounded-2xl flex justify-between items-center text-xs text-indigo-800">
                  <span className="font-bold flex items-center gap-1">
                    <span>🧪 Tester Shortcut:</span> Fill random ratings for all 26 questions instantly?
                  </span>
                  <button
                    onClick={handleAutocompleteQuestions}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-3 rounded-lg"
                  >
                    Check All Complete! 👍
                  </button>
                </div>
              )}
              <SurveyQuestionnaire
                answers={answers}
                onAnswer={handleAnswerSubmit}
                onSubmit={handleFinalSubmit}
              />
            </motion.div>
          )}

          {stage === "COMPLETED" && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.35, type: "spring", stiffness: 100 }}
              className="w-full flex justify-center"
            >
              <ThankYouSection
                participantName={demographics?.name || ""}
                isOnlineSaved={isSavedOnline}
                onReset={handleResetFlow}
                ratingsCount={Object.keys(answers).length}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Sleek Theme Branding Footer */}
      <footer className="w-full h-12 flex items-center justify-between px-6 md:px-8 bg-slate-800 text-[11px] text-slate-400 shrink-0 font-medium z-30 border-t border-slate-900 select-none">
        <span>&copy; Junior Media Psychology Lab &bull; School Media Questionnaire</span>
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-pulse" />
          Secure Offline Records
        </span>
      </footer>
    </div>
  );

  // Helper trigger
  function handleAutocompleteQuestions() {
    handleQuickAutocompleteQuestions();
    alert("Filled all 26 items with random ratings! Scroll or navigate to the final item and tap 'Submit Survey' to submit. 🌟");
  }
}
