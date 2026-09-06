import React, { useMemo } from "react";
import StudentSidebar from "../components/StudentSidebar";
import { readAssessmentResult, readLevelResults } from "../utils/paragraphAssessment";

const PerformanceSummary = () => {
  const assessment = readAssessmentResult();
  const levels = readLevelResults();

  const metrics = useMemo(() => {
    let totalScore = 0;
    let count = 0;
    if (assessment) {
      totalScore += assessment.score || 0;
      count += 1;
    }
    ["easy", "medium", "hard"].forEach((lvl) => {
      if (levels[lvl]) {
        totalScore += levels[lvl].score || 0;
        count += 1;
      }
    });

    const avg = count > 0 ? Math.round(totalScore / count) : 82;
    return {
      sessionsCount: count || 4,
      avgScore: avg,
      confidence: avg >= 85 ? "High" : avg >= 75 ? "Moderate" : "Building",
      clarity: avg >= 80 ? "Good" : "Needs Practice",
      pacing: "Balanced (~130 WPM)",
    };
  }, [assessment, levels]);

  return (
    <div className="flex min-h-screen bg-slate-950 font-poppins text-slate-100">
      <StudentSidebar />

      <main className="flex-1 ml-20">
        {/* Header */}
        <header className="bg-slate-900/90 border-b border-slate-800 px-8 py-4 sticky top-0 z-30 backdrop-blur-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Performance Summary</h1>
              <p className="text-xs text-slate-400">Overview of your communication and interview skills.</p>
            </div>
            <span className="rounded-full bg-cyan-950 border border-cyan-800 px-3 py-0.5 text-xs font-semibold text-cyan-300">
              Analytics
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          {/* Overall Performance Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-cyan-300">Overall Speech Performance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Completed Sessions
                </p>
                <p className="text-2xl font-bold text-white">{metrics.sessionsCount}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Confidence Rating
                </p>
                <p className="text-2xl font-bold text-cyan-300">{metrics.confidence}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Speech Clarity
                </p>
                <p className="text-2xl font-bold text-emerald-400">{metrics.clarity}</p>
              </div>
            </div>
          </div>

          {/* Common Speech Issues Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-3">
            <h3 className="text-base font-bold text-cyan-300">Common Speech Highlights</h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                <span><strong>Filler Words:</strong> Commonly detected words include "uhm", "like", "you know".</span>
              </li>
              <li className="flex items-center gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                <span><strong>Speaking Pace:</strong> Optimal target range is 120 - 150 words per minute for clear call delivery.</span>
              </li>
              <li className="flex items-center gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span><strong>Pronunciation:</strong> Strong word accuracy on customer care greetings and problem-solving passages.</span>
              </li>
            </ul>
          </div>

          {/* AI Improvement Coaching */}
          <div className="rounded-2xl border border-cyan-900/60 bg-linear-to-br from-cyan-950/30 via-slate-900 to-slate-900 p-6 shadow-xl space-y-3">
            <h3 className="text-base font-bold text-cyan-300">AI Speech Coach Recommendation</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              You are showing consistent progress in your vocal delivery and sentence structure. For your upcoming mock interview sessions, focus on taking a short 1-second breath pause before answering to eliminate instinctual filler sounds ("uhm").
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PerformanceSummary;