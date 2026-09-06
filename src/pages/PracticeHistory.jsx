import React, { useMemo } from "react";
import StudentSidebar from "../components/StudentSidebar";
import { readAssessmentResult, readLevelResults } from "../utils/paragraphAssessment";

const PracticeHistory = () => {
  const historyItems = useMemo(() => {
    const items = [];
    const assessment = readAssessmentResult();
    if (assessment) {
      items.push({
        activity: "Paragraph Pre-Assessment",
        level: "Baseline Assessment",
        date: assessment.completedAt ? new Date(assessment.completedAt).toLocaleDateString() : "Recent",
        score: `${assessment.score}/100`,
        status: assessment.score >= 75 ? "Passed" : "Completed",
      });
    }

    const levels = readLevelResults();
    ["easy", "medium", "hard"].forEach((lvl) => {
      if (levels[lvl]) {
        items.push({
          activity: "Paragraph Reading",
          level: lvl.charAt(0).toUpperCase() + lvl.slice(1),
          date: levels[lvl].completedAt ? new Date(levels[lvl].completedAt).toLocaleDateString() : "Recent",
          score: `${levels[lvl].score}/100`,
          status: levels[lvl].score >= 75 ? "Passed" : "Needs Improvement",
        });
      }
    });

    // Default mock history if empty
    if (items.length === 0) {
      items.push(
        {
          activity: "Paragraph Reading",
          level: "Easy Level",
          date: "Recent",
          score: "85/100",
          status: "Passed",
        },
        {
          activity: "Mock Interview",
          level: "Initial Screening",
          date: "Recent",
          score: "Good",
          status: "Completed",
        }
      );
    }
    return items;
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950 font-poppins text-slate-100">
      <StudentSidebar />

      <main className="flex-1 ml-20">
        {/* Header */}
        <header className="bg-slate-900/90 border-b border-slate-800 px-8 py-4 sticky top-0 z-30 backdrop-blur-md">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">Practice History</h1>
            <span className="rounded-full bg-cyan-950 border border-cyan-800 px-3 py-0.5 text-xs font-semibold text-cyan-300">
              Session Log
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white">Completed Practice Sessions</h2>
              <p className="text-xs text-slate-400 mt-1">
                Track your previous paragraph reading scores and mock interview attempts.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Activity</th>
                    <th className="px-6 py-4 font-semibold">Level / Category</th>
                    <th className="px-6 py-4 font-semibold">Date Completed</th>
                    <th className="px-6 py-4 font-semibold">Score / Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                  {historyItems.map((item, idx) => {
                    const isPassed = item.status === "Passed";
                    return (
                      <tr key={idx} className="hover:bg-slate-800/40 transition">
                        <td className="px-6 py-4 font-semibold text-slate-200">{item.activity}</td>
                        <td className="px-6 py-4 text-cyan-300 font-medium">{item.level}</td>
                        <td className="px-6 py-4 text-slate-400 text-xs">{item.date}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                              isPassed
                                ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                : "bg-cyan-950 text-cyan-300 border border-cyan-800"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isPassed ? "bg-emerald-400" : "bg-cyan-400"
                              }`}
                            ></span>
                            {item.score} ({item.status})
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PracticeHistory;