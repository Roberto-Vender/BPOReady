import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [totalUsers, setTotalUsers] = useState(null);
  const [pendingQuestions, setPendingQuestions] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/admin/users`)
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load users.");
        return response.json();
      })
      .then((data) => setTotalUsers(data.total))
      .catch(() => setTotalUsers(0));

    fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/admin/questions?status=pending`)
      .then((res) => res.json())
      .then((data) => setPendingQuestions(data.counts?.pending ?? 0))
      .catch(() => setPendingQuestions(0));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/AdminLogin");
  };

  return (
    <div className="min-h-screen bg-slate-950 font-poppins text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/90 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">BPOReady control center</p>
            <h1 className="mt-1 text-2xl font-bold">Super Admin</h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-rose-400 hover:text-rose-300"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
        {/* Pending Approvals Notice Banner */}
        {pendingQuestions > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-amber-500/50 bg-amber-950/40 p-5 text-amber-200 shadow-lg">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-slate-950 font-bold text-sm">
                !
              </span>
              <div>
                <p className="font-bold text-amber-100">
                  {pendingQuestions} question{pendingQuestions > 1 ? "s" : ""} awaiting your review
                </p>
                <p className="text-xs text-amber-300/80">
                  Admins have submitted questions that require Super Admin approval before going live.
                </p>
              </div>
            </div>
            <Link
              to="/SuperAdminQuestionApprovals"
              className="rounded-lg bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-300 transition shadow-xs self-start sm:self-auto"
            >
              Review Approvals ({pendingQuestions})
            </Link>
          </div>
        )}

        <section className="rounded-2xl border border-cyan-900/60 bg-linear-to-br from-cyan-950 to-slate-900 p-8 shadow-2xl shadow-cyan-950/20">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium text-cyan-300">Full system access</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">Welcome, {user.name || "Super Admin"}</h2>
              <p className="mt-3 max-w-2xl text-slate-300">
                Manage the learning platform, review registered users, and maintain the content used across every applicant experience.
              </p>
            </div>
            <div className="rounded-xl border border-cyan-800 bg-slate-950/50 px-5 py-4 text-left md:min-w-52">
              <p className="text-xs uppercase tracking-wider text-slate-400">Signed in as</p>
              <p className="mt-1 font-semibold text-cyan-200">{user.email || "admin@bpoready.com"}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">Super Admin active</p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">Overview</p>
              <h2 className="mt-1 text-xl font-bold">Platform at a glance</h2>
            </div>
            <span className="text-sm text-slate-400">Live workspace view</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Registered users</p>
              <p className="mt-3 text-4xl font-bold text-white">{totalUsers === null ? "..." : totalUsers}</p>
              <Link to="/SuperAdminUsers" className="mt-4 inline-block text-sm font-semibold text-cyan-400 hover:text-cyan-300">View user list</Link>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Pending Question Approvals</p>
              <p className={`mt-3 text-4xl font-bold ${pendingQuestions > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                {pendingQuestions}
              </p>
              <Link to="/SuperAdminQuestionApprovals" className="mt-4 inline-block text-sm font-semibold text-cyan-400 hover:text-cyan-300">
                {pendingQuestions > 0 ? "Review pending queue" : "Manage all questions"}
              </Link>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">System status</p>
              <p className="mt-3 text-2xl font-bold text-emerald-400">Operational</p>
              <p className="mt-4 text-sm text-slate-500">All administrator tools are available</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-bold">Manage platform content</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Maintain the questions and practice material applicants use throughout the application.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/SuperAdminQuestionApprovals" className="rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300">Manage questions</Link>
              <button type="button" className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-400" disabled>Paragraph materials</button>
              <button type="button" className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-400" disabled>Scoring standards</button>
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-bold">Monitor and secure</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Review platform activity and keep administrator account details current.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/SuperAdminUsers" className="rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-100">Monitor users</Link>
              <Link to="/SuperAdminProfile" className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300">Open profile</Link>
            </div>
          </div>
        </section>

        <section className="flex flex-col justify-between gap-4 rounded-xl border border-cyan-900/70 bg-slate-900 p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold">Need another administrator?</h2>
            <p className="mt-1 text-sm text-slate-400">Create a regular Admin account with limited platform access.</p>
          </div>
          <Link to="/CreateAdminAccount" className="rounded-lg bg-cyan-400 px-5 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-cyan-300">Create Admin Account</Link>
        </section>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
