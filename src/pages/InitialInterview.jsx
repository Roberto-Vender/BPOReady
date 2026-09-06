import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";
import { getQuestions, resetInitialInterviewSession } from "../utils/questionData";

const InitialInterview = () => {
  const { mock } = useMemo(() => getQuestions(), []);
  const questions = useMemo(() => {
    const shuffled = resetInitialInterviewSession();
    return shuffled.length ? shuffled : mock.initial;
  }, [mock.initial]);
  const question = questions[0];

  return (
    <div className="flex min-h-screen bg-slate-950 font-poppins text-slate-100">
      <StudentSidebar />

      <main className="flex-1 ml-20 flex flex-col justify-center items-center p-6 min-h-screen">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl w-full max-w-lg space-y-6">
          {/* Header */}
          <div className="text-center border-b border-slate-800 pb-4">
            <span className="rounded-full bg-cyan-950 border border-cyan-800 px-3 py-0.5 text-xs font-semibold text-cyan-300">
              Mock Interview • Question 1 of {questions.length}
            </span>
            <h2 className="text-xl font-bold text-white mt-3">Initial Screening Interview</h2>
          </div>

          {/* Question Box */}
          <div className="rounded-xl border border-cyan-900/50 bg-slate-950 p-6 text-center shadow-inner space-y-2">
            <p className="text-base font-bold text-slate-100 leading-relaxed">
              "{question?.question || "Please introduce yourself and explain why you want to work in customer service."}"
            </p>
            <p className="text-xs text-slate-400">Provide a clear, professional, and confident response.</p>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Link to="/InitialInterviewRecording" className="block">
              <button className="w-full rounded-xl bg-cyan-400 py-3.5 text-sm font-bold text-slate-950 hover:bg-cyan-300 transition shadow-lg shadow-cyan-950/40">
                🎙️ Start Voice Recording
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InitialInterview;