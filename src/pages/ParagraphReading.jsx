import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PASSING_SCORE, readAssessmentResult, readLevelResults } from "../utils/paragraphAssessment";
import StudentSidebar from "../components/StudentSidebar";

const ParagraphReading = () => {
  const [assessmentResult] = useState(readAssessmentResult);
  const [levelResults] = useState(readLevelResults);
  const assessmentScore = assessmentResult?.score || 0;
  const easyUnlocked = Boolean(assessmentResult);
  const mediumUnlocked = assessmentScore >= PASSING_SCORE && levelResults.easy?.score >= PASSING_SCORE;
  const hardUnlocked = mediumUnlocked && levelResults.medium?.score >= PASSING_SCORE;

  const levels = [
    {
      key: "easy",
      label: "EASY",
      colorClass: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40",
      description: "Build fluency with clear, everyday customer service vocabulary and natural pauses.",
      path: "/easy-level-paragraph-reading",
      unlocked: easyUnlocked,
    },
    {
      key: "medium",
      label: "MEDIUM",
      colorClass: "bg-amber-500/20 text-amber-300 border border-amber-500/40",
      description: "Manage longer sentences, professional problem-solving phrasing, and changing ideas.",
      path: "/medium-level-paragraph-reading",
      unlocked: mediumUnlocked,
    },
    {
      key: "hard",
      label: "HARD",
      colorClass: "bg-rose-500/20 text-rose-300 border border-rose-500/40",
      description: "Read precise, advanced professional language, technical explanations, and complex syntax.",
      path: "/hard-level-paragraph-reading",
      unlocked: hardUnlocked,
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 font-poppins text-slate-100">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-20">
        {/* Header */}
        <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-md px-8 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-100">Paragraph Reading Practice</h1>
            <span className="rounded-full bg-cyan-950 border border-cyan-800 px-3 py-0.5 text-xs font-semibold text-cyan-300">
              Fluency & Cadence
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
          {/* Title Section */}
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white">Master Your Speech Flow</h2>
            <p className="text-sm text-slate-400 mt-2">
              Complete each level with a 75+ score to unlock subsequent levels and build your speaking cadence step by step.
            </p>
          </div>

          {/* Pre-Assessment Card */}
          <div className="rounded-2xl border border-cyan-900/60 bg-linear-to-br from-cyan-950 via-slate-900 to-slate-900 p-7 shadow-2xl shadow-cyan-950/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs border border-cyan-500/40">
                    ★
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {assessmentResult ? "Pre-assessment Completed" : "Start with a Pre-assessment"}
                  </h3>
                </div>
                <p className="text-sm text-slate-300">
                  {assessmentResult
                    ? "You have already completed your initial pre-assessment. Practice and pass each level below to progress."
                    : "Read one short paragraph to find your baseline speaking pace and unlock your personalized levels."}
                </p>
              </div>

              {assessmentResult ? (
                <Link to="/paragraph-result/assessment" className="shrink-0">
                  <button className="rounded-xl bg-cyan-400 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition shadow-lg shadow-cyan-950/40">
                    View Assessment Result
                  </button>
                </Link>
              ) : (
                <Link to="/paragraph-assessment/assessment" className="shrink-0">
                  <button className="rounded-xl bg-cyan-400 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition shadow-lg shadow-cyan-950/40">
                    Start Pre-assessment
                  </button>
                </Link>
              )}
            </div>

            {assessmentResult && (
              <div className="mt-4 flex flex-wrap items-center justify-between border-t border-slate-800/80 pt-3 gap-2">
                <p className="text-xs font-semibold text-cyan-300">
                  Pre-assessment Score: <strong className="text-white text-sm">{assessmentScore}/100</strong>
                </p>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/70 border border-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                  Assessment Completed (Single Attempt)
                </span>
              </div>
            )}
          </div>

          {/* Levels Grid */}
          <div className="space-y-4">
            {levels.map((level) => (
              <div
                key={level.key}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-2xl border p-6 transition shadow-xl ${
                  level.unlocked
                    ? "border-slate-800 bg-slate-900/90 hover:border-slate-700"
                    : "border-slate-900 bg-slate-950/40 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl p-2 text-center text-xs font-extrabold tracking-wider ${level.colorClass}`}
                  >
                    {level.label}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-base text-white">{level.label} Level</h4>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
                      {level.description}
                    </p>
                    <p className="text-[11px] pt-1">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          level.unlocked ? "text-emerald-400" : "text-slate-500"
                        }`}
                      >
                        {level.unlocked ? "Available to Practice" : `Locked - requires ${PASSING_SCORE}+ points on previous level`}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-auto">
                  {level.unlocked ? (
                    <Link to={level.path}>
                      <button className="rounded-xl bg-emerald-500 px-7 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition shadow-lg shadow-emerald-950/30">
                        Start Reading
                      </button>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="cursor-not-allowed rounded-xl border border-slate-800 bg-slate-900/50 px-7 py-2.5 text-xs font-semibold text-slate-600"
                    >
                      Locked
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ParagraphReading;