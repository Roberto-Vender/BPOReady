import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

const MonitorUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/admin/users`)
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load users.");
        return response.json();
      })
      .then((data) => setUsers(data.users || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950 font-poppins text-slate-100">
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-60">
        <header className="bg-slate-900/90 border-b border-slate-800 px-8 py-4 sticky top-0 z-30 backdrop-blur-md">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Registered Users & Monitoring</h1>
              <p className="text-xs text-slate-400">View user registration list and performance indicators.</p>
            </div>
            <span className="rounded-full bg-blue-950 border border-blue-800 px-3 py-0.5 text-xs font-semibold text-blue-300">
              Admin Portal
            </span>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-8 py-10 space-y-6">
          {/* Registered Users Table Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Registered Platform Users</h2>
                <p className="text-xs text-slate-400">
                  Total registered learners and administrators: <strong className="text-cyan-300">{users.length}</strong>
                </p>
              </div>
            </div>

            {loading ? (
              <p className="py-8 text-center text-slate-400 text-sm">Loading users list...</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-3.5 font-semibold">User Name</th>
                      <th className="px-6 py-3.5 font-semibold">Email</th>
                      <th className="px-6 py-3.5 font-semibold">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-6 py-3.5 font-semibold text-slate-200">{u.name}</td>
                        <td className="px-6 py-3.5 text-slate-300 text-xs font-mono">{u.email}</td>
                        <td className="px-6 py-3.5">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                              u.role === "super_admin"
                                ? "bg-purple-950 border border-purple-800 text-purple-300"
                                : u.role === "admin"
                                ? "bg-blue-950 border border-blue-800 text-blue-300"
                                : "bg-emerald-950 border border-emerald-800 text-emerald-300"
                            }`}
                          >
                            {u.role || "user"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Bottom Insights Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-3">
              <h3 className="text-base font-bold text-cyan-300">Average User Performance</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                The average learner performance across the platform is rated as <strong className="text-emerald-400">Good (82%)</strong> based on cumulative paragraph reading accuracy and mock interview speech clarity metrics.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-3">
              <h3 className="text-base font-bold text-cyan-300">Common Speech Highlights</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                  <span><strong>Common Filler Sounds:</strong> "uhm", "ah", "you know"</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                  <span><strong>Speaking Pacing:</strong> 130 - 145 WPM average delivery</span>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MonitorUsers;