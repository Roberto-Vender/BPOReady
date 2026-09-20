import React, { useEffect, useMemo, useState } from "react";
import StudentSidebar from "../components/StudentSidebar";
import {
  readAssessmentResult,
  readLevelResults,
  getCurrentUser,
  syncUserAssessmentsFromApi,
} from "../utils/paragraphAssessment";

const PracticeHistory = () => {
  const currentUser = getCurrentUser();
  const [dbHistory, setDbHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.email) {
      setLoading(false);
      return;
    }

    syncUserAssessmentsFromApi(currentUser)
      .then((data) => {
        if (data?.history) {
          setDbHistory(data.history);
        }
      })
      .finally(() => setLoading(false));
  }, [currentUser?.email]);

  const historyItems = useMemo(() => {
    if (dbHistory.length > 0) {
      return dbHistory.map((item) => {
        const isAssessment = item.level === "assessment";
        const levelName = isAssessment
          ? "Pre-Assessment"
          : `${item.level.charAt(0).toUpperCase() + item.level.slice(1)} Level`;
        const activity = isAssessment ? "Baseline Assessment" : "Paragraph Reading";
        const isPassed = item.score >= 75;

        return {
          activity,
          level: levelName,
          date: item.completed_at ? new Date(item.completed_at).toLocaleDateString() : "Recent",
          score: `${item.score}/100`,
          status: isPassed ? "Passed" : "Needs Improvement",
        };
      });
    }

    // Fallback to user-scoped storage
    const items = [];
    const assessment = readAssessmentResult(currentUser);
    if (assessment) {
      items.push({
        activity: "Baseline Assessment",
        level: "Pre-Assessment",
        date: assessment.completedAt ? new Date(assessment.completedAt).toLocaleDateString() : "Recent",
        score: `${assessment.score}/100`,
        status: assessment.score >= 75 ? "Passed" : "Needs Improvement",
      });
    }

    const levels = readLevelResults(currentUser);
    ["easy", "medium", "hard"].forEach((lvl) => {
      if (levels[lvl]) {
        items.push({
          activity: "Paragraph Reading",
          level: `${lvl.charAt(0).toUpperCase() + lvl.slice(1)} Level`,
          date: levels[lvl].completedAt ? new Date(levels[lvl].completedAt).toLocaleDateString() : "Recent",
          score: `${levels[lvl].score}/100`,
          status: levels[lvl].score >= 75 ? "Passed" : "Needs Improvement",
        });
      }
    });

    return items;
  }, [dbHistory, currentUser]);

  return (
    <div className="flex min-h-screen bg-slate-950 font-poppins text-slate-100">
      <StudentSidebar />

      <main className="flex-1 ml-20">
        {/* Header */}
        <header className="bg-slate-900/90 border-b border-slate-800 px-8 py-4 sticky top-0 z-30 backdrop-blur-md">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Practice History</h1>
              <p className="text-xs text-slate-400">Account session records for {currentUser?.name || "Learner"}</p>
            </div>
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
                Track your previous paragraph reading evaluations and scoring progress.
              </p>
            </div>

            {loading ? (
              <div className="py-12 text-center text-sm text-slate-400">Loading session history...</div>
            ) : historyItems.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-800 py-12 text-center text-slate-400">
                <p className="text-base font-bold text-slate-300">No practice sessions recorded yet.</p>
                <p className="text-xs text-slate-500 mt-1">Complete your Pre-Assessment to begin logging your practice progress.</p>
              </div>
            ) : (
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
                                  ? "bg-emerald-950/70 border border-emerald-700/60 text-emerald-300"
                                  : "bg-rose-950/70 border border-rose-700/60 text-rose-300"
                              }`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${isPassed ? "bg-emerald-400" : "bg-rose-400"}`}></span>
                              {item.score} • {item.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PracticeHistory;