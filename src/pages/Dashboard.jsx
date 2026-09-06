import React from "react";
import { Link } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";

const Dashboard = () => {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  const firstName = user?.name ? user.name.split(" ")[0] : "Learner";

  return (
    <div className="flex min-h-screen bg-slate-950 font-poppins text-slate-100">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-20">
        {/* Top Header */}
        <header className="bg-slate-900/90 border-b border-slate-800 px-8 py-4 sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-100">Learner Dashboard</h1>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-medium">Signed in as</span>
              <span className="rounded-full bg-cyan-950 border border-cyan-700/60 px-3 py-1 text-xs font-bold text-cyan-300">
                {user?.name || "Student"}
              </span>
            </div>
          </div>
        </header>

        <main className="p-8 max-w-6xl mx-auto space-y-8">
          {/* Welcome Banner */}
          <section className="rounded-2xl border border-cyan-900/60 bg-linear-to-br from-cyan-950 via-slate-900 to-slate-900 p-8 shadow-2xl shadow-cyan-950/25">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                BPO Training & Communication Mastery
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
                Welcome back, <span className="text-cyan-300">{firstName}!</span>
              </h2>
              <p className="mt-3 text-slate-300 text-sm leading-relaxed">
                Continue refining your speech delivery, pacing, pronunciation, and interview confidence to land top BPO customer support and technical roles.
              </p>
            </div>
          </section>

          {/* Quick Practice Actions */}
          <section className="grid gap-6 md:grid-cols-2">
            {/* Paragraph Reading Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4 hover:border-slate-700 transition">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  📄
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Paragraph Reading</h3>
                  <p className="text-xs text-slate-400">Fluency, cadence, and filler-word detection</p>
                </div>
              </div>
              <p className="text-sm text-slate-300">
                Read structured customer service paragraphs with real-time speech assessment and interactive pacing drills.
              </p>
              <Link to="/ParagraphReading" className="inline-block pt-2">
                <button className="rounded-xl bg-cyan-400 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition shadow-md shadow-cyan-950/40">
                  Go to Paragraph Reading →
                </button>
              </Link>
            </div>

            {/* Mock Interview Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4 hover:border-slate-700 transition">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  🎙️
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Mock Interview</h3>
                  <p className="text-xs text-slate-400">AI-powered speech, grammar & coaching</p>
                </div>
              </div>
              <p className="text-sm text-slate-300">
                Practice actual BPO interview questions with AI evaluation on grammar, clarity, pacing, and instant coaching feedback.
              </p>
              <Link to="/MockInterview" className="inline-block pt-2">
                <button className="rounded-xl bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-400 transition shadow-md shadow-indigo-950/40">
                  Start Mock Interview →
                </button>
              </Link>
            </div>
          </section>

          {/* Activity & Performance Row */}
          <section className="grid gap-6 md:grid-cols-2">
            {/* Recent Progress */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100">Practice Modules</h3>
                <Link to="/PracticeHistory" className="text-xs text-cyan-400 hover:underline font-semibold">
                  View History
                </Link>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                    <span className="text-slate-200">Paragraph Reading Practice</span>
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold">Available</span>
                </li>
                <li className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                    <span className="text-slate-200">Initial Mock Interview</span>
                  </div>
                  <span className="text-xs text-cyan-400 font-semibold">Available</span>
                </li>
                <li className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-indigo-400"></span>
                    <span className="text-slate-200">Grammar & Pacing Drills</span>
                  </div>
                  <span className="text-xs text-indigo-300 font-semibold">Active</span>
                </li>
              </ul>
            </div>

            {/* Performance Overview */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-100">Performance Summary</h3>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400">Metrics</span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                    <p className="text-xs text-slate-400">Clarity</p>
                    <p className="mt-1 text-base font-bold text-emerald-400">Good</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                    <p className="text-xs text-slate-400">Pacing</p>
                    <p className="mt-1 text-base font-bold text-cyan-400">Steady</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                    <p className="text-xs text-slate-400">Grammar</p>
                    <p className="mt-1 text-base font-bold text-indigo-400">Guided</p>
                  </div>
                </div>
              </div>
              <Link to="/PerformanceSummary" className="w-full">
                <button className="w-full rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 text-xs font-bold text-slate-200 hover:border-cyan-400 hover:text-cyan-300 transition">
                  View Detailed Performance Summary →
                </button>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;