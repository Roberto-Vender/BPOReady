import React from "react";
import { Link, useNavigate } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";

const MockInterview = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-slate-950 font-poppins text-slate-100">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-20">
        {/* Header */}
        <header className="bg-slate-900/90 border-b border-slate-800 px-8 py-4 sticky top-0 z-30 backdrop-blur-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">Mock Interview Simulation</h1>
            <span className="rounded-full bg-cyan-950 border border-cyan-800 px-3 py-0.5 text-xs font-semibold text-cyan-300">
              AI Voice & Coaching
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white">Simulate Real BPO Interviews</h2>
            <p className="text-sm text-slate-400 mt-2">
              Practice answering actual customer service questions with AI-powered feedback on grammar, confidence, pacing, and filler words.
            </p>
          </div>

          {/* Interview Type Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Initial Interview Card */}
            <div className="rounded-2xl border border-cyan-900/60 bg-linear-to-br from-cyan-950/40 via-slate-900 to-slate-900 p-7 shadow-xl flex flex-col justify-between hover:border-cyan-700/80 transition">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Initial Interview Questions</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Fundamental HR & communication screening questions assessing background, English fluency, and customer service aptitude.
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <Link to="/InitialInterview">
                  <button className="w-full rounded-xl bg-cyan-400 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition shadow-lg shadow-cyan-950/40">
                    Start Initial Interview →
                  </button>
                </Link>
              </div>
            </div>

            {/* Final Interview Card */}
            <div className="rounded-2xl border border-purple-900/60 bg-linear-to-br from-purple-950/40 via-slate-900 to-slate-900 p-7 shadow-xl flex flex-col justify-between hover:border-purple-700/80 transition">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Final / Operations Interview</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Challenging behavioral, de-escalation, and situational call scenarios for operations managers and team leaders.
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => navigate("/InitialInterview")}
                  className="w-full rounded-xl bg-purple-500 py-3 text-xs font-bold text-white hover:bg-purple-400 transition shadow-lg shadow-purple-950/40"
                >
                  Start Operations Interview →
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MockInterview;
