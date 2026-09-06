import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPracticeExercises, paragraphContent, readAssessmentResult, readLevelResults } from "../utils/paragraphAssessment";
import PacingExercise from "./PacingExercise";
import StudentSidebar from "../components/StudentSidebar";

const speakWord = (word) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  utterance.rate = 0.75;
  window.speechSynthesis.speak(utterance);
};

const ParagraphAssessmentResult = ({ level: levelProp }) => {
  const { level: routeLevel } = useParams();
  const level = routeLevel || levelProp || "assessment";
  const result = level === "assessment" ? readAssessmentResult() : readLevelResults()[level];
  const isPassed = result?.score >= 75;
  const nextPath = level === "assessment" ? "/ParagraphReading" : level === "easy" ? "/medium-level-paragraph-reading" : level === "medium" ? "/hard-level-paragraph-reading" : "/ParagraphReading";
  const retryPath = level === "assessment" ? "/paragraph-assessment/assessment" : `/paragraph-assessment/${level}`;
  const fillerSummary = result ? Object.entries(result.fillerCounts).map(([word, count]) => `"${word}" (${count})`).join(", ") || "None detected" : "Unavailable";
  const exercises = getPracticeExercises(result, level);
  const isPacingIssue = Boolean(result?.pacePenalty > 0 || result?.pacing === "Too fast" || result?.pacing === "Too slow");
  const [showPacingDrill, setShowPacingDrill] = useState(isPacingIssue);

  const currentParagraphText = paragraphContent[level]?.text || paragraphContent.assessment.text;

  return (
    <div className="flex min-h-screen bg-slate-950 font-poppins text-slate-100">
      <StudentSidebar />

      <main className="ml-20 flex-1">
        <header className="bg-slate-900/90 border-b border-slate-800 px-8 py-4 sticky top-0 z-30 backdrop-blur-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">
              {paragraphContent[level]?.title || "Pre-Assessment"} Result
            </h1>
            <Link to="/ParagraphReading" className="text-xs text-cyan-400 hover:underline font-semibold">
              ← Back to Levels
            </Link>
          </div>
        </header>

        <section className="mx-auto max-w-3xl px-6 py-10">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl space-y-6">
            {/* Header Score Overview */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-5 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Speech Analysis Summary</h2>
                <p className="text-xs text-slate-400 mt-0.5">Automated AI cadence and word accuracy breakdown</p>
              </div>
              {result && (
                <div className={`rounded-xl border px-5 py-3 text-center ${
                  isPassed
                    ? "border-emerald-700/60 bg-emerald-950/40 text-emerald-300"
                    : "border-rose-700/60 bg-rose-950/40 text-rose-300"
                }`}>
                  <p className="text-[10px] font-bold uppercase tracking-wider">Overall Score</p>
                  <p className="text-3xl font-extrabold">{result.score}/100</p>
                </div>
              )}
            </div>

            {result ? (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                      Speaking Pace
                    </span>
                    <p className="text-base font-bold text-cyan-300">
                      {result.wordsPerMinute || 0} WPM
                    </p>
                    <span className="text-[10px] text-slate-500">Target: {result.targetWordsPerMinute} WPM</span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                      Filler Words
                    </span>
                    <p className="text-base font-bold text-amber-400">
                      {result.fillers.length}
                    </p>
                    <span className="text-[10px] text-slate-500">{result.ummUhhTotal} Umms/Uhhs</span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                      Clarity & Flow
                    </span>
                    <p className="text-base font-bold text-emerald-400">
                      {result.clarity}
                    </p>
                    <span className="text-[10px] text-slate-500">Pacing: {result.pacing}</span>
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2 text-xs text-slate-300">
                  <p><strong className="text-slate-200">Filler Words Detected:</strong> {fillerSummary}</p>
                  <p><strong className="text-slate-200">Total Words Spoken:</strong> {result.totalWords}</p>
                  <p><strong className="text-slate-200">Reading Duration:</strong> {result.durationSeconds || 0} seconds</p>
                  <p><strong className="text-slate-200">Confidence Level:</strong> {result.confidence}</p>
                </div>

                {/* Point Deductions Box */}
                <div className="rounded-xl border border-rose-900/60 bg-rose-950/30 p-5 space-y-2 text-xs text-rose-200">
                  <p className="font-bold text-sm text-rose-100">Scoring Point Breakdown</p>
                  <p>Pronunciation or missed words: -{result.pronunciationPenalty || 0} points</p>
                  <p>Filler words: -{result.fillerPenalty || 0} points</p>
                  <div className="flex items-center justify-between">
                    <p>Pacing: -{result.pacePenalty || 0} points</p>
                    {result.pacePenalty > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowPacingDrill(true)}
                        className="rounded-lg bg-cyan-400 px-3 py-1 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition"
                      >
                        Launch Pacing Drill
                      </button>
                    )}
                  </div>

                  {result.wrongWords?.length > 0 && (
                    <div className="mt-3 border-t border-rose-900/60 pt-3 space-y-2">
                      <p className="font-bold text-rose-100">Words to practice:</p>
                      {result.wrongWords.map((word, index) => (
                        <div key={`${word.said}-${index}`} className="flex items-center justify-between gap-2 bg-slate-950/60 p-2 rounded-lg">
                          <span>You said <strong className="text-white">"{word.said}"</strong>; expected <strong className="text-cyan-300">"{word.expected}"</strong>.</span>
                          <button
                            type="button"
                            onClick={() => speakWord(word.expected)}
                            className="rounded-md bg-slate-800 border border-slate-700 px-2 py-1 text-[11px] font-bold text-cyan-400 hover:bg-slate-700"
                          >
                            🔊 Listen
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Practice Exercises Container */}
                {exercises.length > 0 && (
                  <div className="rounded-xl border border-cyan-900/60 bg-cyan-950/20 p-5 text-slate-200 space-y-3">
                    <h3 className="text-base font-bold text-cyan-300">Recommended Practice Drills</h3>
                    {exercises.map((exercise) => (
                      <div key={exercise.title} className="flex items-start justify-between gap-3 border-b border-cyan-900/40 pb-2 last:border-0 last:pb-0">
                        <div>
                          <p className="font-bold text-xs text-white">{exercise.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{exercise.instruction}</p>
                        </div>
                        {exercise.type === "pacing" && (
                          <button
                            type="button"
                            onClick={() => setShowPacingDrill((prev) => !prev)}
                            className="shrink-0 rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition"
                          >
                            {showPacingDrill ? "Hide Drill" : "Start Pacing Drill"}
                          </button>
                        )}
                      </div>
                    ))}

                    {/* Inline Pacing Exercise Drill */}
                    {showPacingDrill && (
                      <div className="mt-4 pt-4 border-t border-cyan-900/50">
                        <PacingExercise
                          level={level}
                          text={currentParagraphText}
                          initialTargetWpm={result.targetWordsPerMinute}
                          userPreviousWpm={result.wordsPerMinute}
                          onClose={() => setShowPacingDrill(false)}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Pass/Fail Status Banner */}
                <div
                  className={`rounded-xl border p-4 text-xs font-medium ${
                    isPassed
                      ? "border-emerald-800/80 bg-emerald-950/40 text-emerald-200"
                      : "border-amber-800/80 bg-amber-950/40 text-amber-200"
                  }`}
                >
                  {level === "assessment"
                    ? isPassed
                      ? "✓ You scored 75 or higher. Medium and Hard are now unlocked!"
                      : "✓ Your pre-assessment has unlocked the Easy level. Practice and complete each level with 75+ to progress."
                    : isPassed
                    ? "✓ Level passed! Keep practicing to strengthen your communication skills."
                    : "You need at least 75 points to pass this level and unlock the next one."}
                </div>
              </>
            ) : (
              <p className="text-slate-400 text-sm">No result was found. Complete the reading first.</p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {level !== "assessment" && (
                <Link to={retryPath}>
                  <button className="rounded-xl border border-slate-700 bg-slate-800 px-8 py-3 text-xs font-bold text-slate-200 hover:border-cyan-400 hover:text-cyan-300 transition">
                    Retry Reading
                  </button>
                </Link>
              )}
              <Link to={result && isPassed ? nextPath : "/ParagraphReading"}>
                <button className="rounded-xl bg-emerald-500 px-8 py-3 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition shadow-lg shadow-emerald-950/40">
                  {result && isPassed ? (level === "hard" ? "Back to Levels" : "Continue →") : "Back to Levels"}
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ParagraphAssessmentResult;
