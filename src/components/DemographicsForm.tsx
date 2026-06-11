import React, { useState } from "react";
import { Demographics } from "../types";
import { User, Sparkles } from "lucide-react";

interface DemographicsFormProps {
  onSubmit: (data: Demographics) => void;
}

export function DemographicsForm({ onSubmit }: DemographicsFormProps) {
  const [formData, setFormData] = useState<Partial<Demographics>>({
    name: "",
    age: "",
    gender: "",
    schoolType: "",
    siblings: "",
    studyingClass: "",
    screenTime: "",
    consent: false,
  });

  const [error, setError] = useState<string | null>(null);

  const handleGenderSelect = (gender: string) => {
    setFormData((prev) => ({ ...prev, gender }));
  };

  const handleSchoolTypeSelect = (schoolType: string) => {
    setFormData((prev) => ({ ...prev, schoolType }));
  };

  const handleSiblingsSelect = (siblings: string) => {
    setFormData((prev) => ({ ...prev, siblings }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      setError("Please write your name! ✏️");
      return;
    }
    if (!formData.age) {
      setError("Please select your age! 📅");
      return;
    }
    if (!formData.gender) {
      setError("Please select your gender! 👦👧");
      return;
    }
    if (!formData.schoolType) {
      setError("Please choose your school type! 🏫");
      return;
    }
    if (formData.siblings === undefined || formData.siblings === "") {
      setError("Please select how many siblings you have! 🧑‍🤝‍🧑");
      return;
    }
    if (!formData.studyingClass) {
      setError("Please tell us which class you are studying in! 📚");
      return;
    }
    if (!formData.screenTime) {
      setError("Please choose your daily screen time! 📺");
      return;
    }
    if (!formData.consent) {
      setError("Please check the green consent box! ✅");
      return;
    }

    setError(null);
    onSubmit(formData as Demographics);
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col border border-slate-200">
      
      {/* Sleek Brand Header */}
      <div className="bg-orange-500 p-6 md:p-8 text-white relative flex flex-col items-center text-center shadow-sm">
        <div className="absolute top-4 right-4">
          <Sparkles className="w-6 h-6 text-orange-200 animate-pulse" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold font-sans tracking-tight uppercase">
          Demographics Survey
        </h2>
        <p className="text-orange-100 text-sm mt-1">
          Please fill in the details below to begin your research session
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-650 px-4 py-3 rounded-xl text-center font-bold animate-pulse text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Name input box */}
        <div className="space-y-2">
          <label className="block text-xs uppercase font-extrabold text-slate-500 tracking-wider">
            1. Participant Full Name:
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter name or participant code..."
              value={formData.name || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 pl-11 text-slate-800 placeholder-slate-450 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all font-medium text-sm"
            />
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5 pointer-events-none" />
          </div>
        </div>

        {/* Age & Class Study details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs uppercase font-extrabold text-slate-500 tracking-wider">
              2. Participant Age:
            </label>
            <select
              value={formData.age || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50 transition-all text-sm font-medium"
            >
              <option value="">Select Age...</option>
              {Array.from({ length: 15 }, (_, i) => i + 4).map((a) => (
                <option key={a} value={a}>
                  {a} Years Old
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs uppercase font-extrabold text-slate-500 tracking-wider">
              3. Current Class Group:
            </label>
            <select
              value={formData.studyingClass || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, studyingClass: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50 transition-all text-sm font-medium"
            >
              <option value="">Select Class...</option>
              <option value="Pre-School">Pre-School / Kindergarten</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((c) => (
                <option key={c} value={`Class ${c}`}>
                  Grade / Class {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Gender Choice Buttons */}
        <div className="space-y-2.5">
          <label className="block text-xs uppercase font-extrabold text-slate-500 tracking-wider">
            4. Participant Gender:
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "Boy", label: "Boy 👦" },
              { id: "Girl", label: "Girl 👧" },
              { id: "Other", label: "Other 😊" }
            ].map((btn) => {
              const isActive = formData.gender === btn.id;
              return (
                <button
                  type="button"
                  key={btn.id}
                  onClick={() => handleGenderSelect(btn.id)}
                  className={`border py-3 rounded-xl text-center font-bold text-sm transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-800 border-slate-800 text-white shadow-md"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-350"
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* School Category */}
        <div className="space-y-2.5">
          <label className="block text-xs uppercase font-extrabold text-slate-500 tracking-wider">
            5. School Classification:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { id: "Private", label: "Private Institution", desc: "Private fee arrangements (Elite)" },
              { id: "Government", label: "Government Institution", desc: "State-funded public education" }
            ].map((btn) => {
              const isActive = formData.schoolType === btn.id;
              return (
                <button
                  type="button"
                  key={btn.id}
                  onClick={() => handleSchoolTypeSelect(btn.id)}
                  className={`border p-3.5 rounded-xl text-left cursor-pointer transition-all ${
                    isActive
                      ? "bg-orange-50 border-orange-500 text-orange-950 ring-2 ring-orange-120"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                  }`}
                >
                  <p className="font-bold text-sm">{btn.label}</p>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">{btn.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Siblings slider/options */}
        <div className="space-y-2.5">
          <label className="block text-xs uppercase font-extrabold text-slate-500 tracking-wider">
            6. Sibling Count (Brothers/Sisters):
          </label>
          <div className="grid grid-cols-5 gap-2">
            {["0", "1", "2", "3", "4+"].map((label) => {
              const isActive = formData.siblings === label;
              return (
                <button
                  type="button"
                  key={label}
                  onClick={() => handleSiblingsSelect(label)}
                  className={`border py-2.5 rounded-xl text-center font-bold text-xs transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-800 border-slate-800 text-white shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Daily Screen duration */}
        <div className="space-y-2">
          <label className="block text-xs uppercase font-extrabold text-slate-500 tracking-wider">
            7. Approximate Daily Screen Time (TV/Mobile):
          </label>
          <select
            value={formData.screenTime || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, screenTime: e.target.value }))}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50 transition-all text-sm font-medium"
          >
            <option value="">Select duration...</option>
            <option value="Less than 1 hour">⏱️ Under 1 Hour</option>
            <option value="1-2 hours">📺 1 - 2 Hours</option>
            <option value="2-3 hours">🎮 2 - 3 Hours</option>
            <option value="More than 3 hours">📱 More than 3 Hours</option>
          </select>
        </div>

        {/* Safety consent agreement check */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mt-4">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.consent || false}
              onChange={(e) => setFormData((prev) => ({ ...prev, consent: e.target.checked }))}
              className="w-5 h-5 rounded accent-orange-500 border border-slate-300 mt-0.5 cursor-pointer flex-shrink-0"
              id="consent-check"
            />
            <div className="text-xs text-slate-600 leading-normal">
              <span className="font-bold text-slate-700">Participation Consent:</span> I agree to participate in this academic research survey. I understand I will review 4 sequential advertisements and reply to 26 short attitude items. All actions are handled securely.
            </div>
          </label>
        </div>

        {/* Submit Progress Button */}
        <button
          type="submit"
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl text-sm shadow-md hover:shadow-orange-100 hover:shadow-lg hover:scale-[1.002] active:scale-98 transition-all cursor-pointer text-center uppercase tracking-wider"
        >
          Proceed to Instructions
        </button>
      </form>
    </div>
  );
}
