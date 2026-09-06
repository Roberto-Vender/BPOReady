import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/admin/users`)
      .then((res) => res.json())
      .then((data) => setTotalUsers(data.total))
      .catch(() => setTotalUsers(128));

    fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/admin/questions`)
      .then((res) => res.json())
      .then((data) => {
        setTotalQuestions(data.counts?.approved ?? 0);
        setPendingCount(data.counts?.pending ?? 0);
      })
      .catch(() => setTotalQuestions(0));
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950 font-poppins text-slate-100">
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-60">
        <header className="bg-slate-900/90 border-b border-slate-800 px-8 py-4 sticky top-0 z-30 backdrop-blur-md">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-xs text-slate-400">Content contributor and learner monitoring portal.</p>
            </div>
            <span className="rounded-full bg-blue-950 border border-blue-800 px-3 py-0.5 text-xs font-semibold text-blue-300">
              Admin Portal
            </span>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-8 py-10 space-y-8">
          {/* Welcome Card */}
          <section className="rounded-2xl border border-cyan-900/60 bg-linear-to-br from-cyan-950 via-slate-900 to-slate-900 p-8 shadow-2xl shadow-cyan-950/25">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Platform Administration
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
              Welcome to the Administrator Workspace
            </h2>
            <p className="mt-2 max-w-2xl text-xs text-slate-300 leading-relaxed">
              Submit practice questions for Super Admin review, monitor applicant performance, and maintain platform quality.
            </p>
          </section>

          {/* Stats Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Registered Platform Users
              </p>
              <p className="text-3xl font-extrabold text-white">
                {totalUsers === null ? "..." : totalUsers}
              </p>
              <Link
                to="/MonitorUsers"
                className="inline-block pt-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
              >
                View user list →
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Live Active Questions
              </p>
              <p className="text-3xl font-extrabold text-cyan-300">
                {totalQuestions === null ? "..." : totalQuestions}
              </p>
              <Link
                to="/ManageInterviewQuestions"
                className="inline-block pt-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
              >
                Manage & submit questions →
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Submissions in Review
              </p>
              <p className="text-3xl font-extrabold text-amber-400">{pendingCount}</p>
              <p className="text-xs text-slate-500 pt-1">
                Awaiting Super Admin approval
              </p>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-cyan-300">Quick Administrative Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/ManageInterviewQuestions"
                className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-cyan-500/40 hover:bg-slate-900 transition"
              >
                <div>
                  <h4 className="font-bold text-sm text-white">Submit New Question</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Add paragraph reading or mock interview questions.</p>
                </div>
                <span className="text-cyan-400 font-bold">→</span>
              </Link>

              <Link
                to="/MonitorUsers"
                className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-cyan-500/40 hover:bg-slate-900 transition"
              >
                <div>
                  <h4 className="font-bold text-sm text-white">Monitor Users & Scores</h4>
                  <p className="text-xs text-slate-400 mt-0.5">View user list and speech assessment metrics.</p>
                </div>
                <span className="text-cyan-400 font-bold">→</span>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;