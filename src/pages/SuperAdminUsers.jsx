import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SuperAdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // 'all' | 'user' | 'admin' | 'super_admin'

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/admin/users`);
      if (!res.ok) throw new Error("Failed to load users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/AdminLogin");
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || (u.role || "user") === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const stats = useMemo(() => {
    const total = users.length;
    const superAdmins = users.filter((u) => u.role === "super_admin").length;
    const admins = users.filter((u) => u.role === "admin").length;
    const regularUsers = users.filter((u) => !u.role || u.role === "user").length;
    return { total, superAdmins, admins, regularUsers };
  }, [users]);

  return (
    <div className="min-h-screen bg-slate-950 font-poppins text-slate-100">
      {/* Super Admin Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 px-6 py-4 sticky top-0 z-30 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/SuperAdminDashboard" className="flex items-center gap-2">
              <span className="text-xl font-bold text-cyan-400">BPOReady</span>
              <span className="rounded bg-cyan-950 border border-cyan-700/60 px-2 py-0.5 text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                Super Admin
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-2 text-sm">
              <Link
                to="/SuperAdminDashboard"
                className="rounded-lg px-3 py-2 text-slate-400 hover:text-slate-200 transition"
              >
                Dashboard
              </Link>
              <Link
                to="/SuperAdminQuestionApprovals"
                className="rounded-lg px-3 py-2 text-slate-400 hover:text-slate-200 transition"
              >
                Question Approvals
              </Link>
              <Link
                to="/SuperAdminUsers"
                className="rounded-lg bg-slate-800 px-3 py-2 font-semibold text-cyan-400 border border-slate-700"
              >
                User List
              </Link>
              <Link
                to="/CreateAdminAccount"
                className="rounded-lg px-3 py-2 text-slate-400 hover:text-slate-200 transition"
              >
                Create Admin
              </Link>
            </nav>
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
        {/* Title Header */}
        <section className="rounded-2xl border border-cyan-900/60 bg-linear-to-br from-cyan-950 to-slate-900 p-8 shadow-2xl shadow-cyan-950/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                User Management & Monitoring
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
                Registered Platform Users
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                Monitor all registered applicants, staff members, and administrators across the BPOReady platform.
              </p>
            </div>

            <Link
              to="/CreateAdminAccount"
              className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300 transition shadow-lg shadow-cyan-950/40 self-start sm:self-auto"
            >
              + Create Admin Account
            </Link>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Total Users
            </p>
            <p className="mt-2 text-3xl font-bold text-white">{stats.total}</p>
            <p className="mt-1 text-xs text-slate-400">All registered accounts</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Applicants / Students
            </p>
            <p className="mt-2 text-3xl font-bold text-emerald-400">{stats.regularUsers}</p>
            <p className="mt-1 text-xs text-slate-400">Regular learners</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Administrators
            </p>
            <p className="mt-2 text-3xl font-bold text-blue-400">{stats.admins}</p>
            <p className="mt-1 text-xs text-slate-400">Question contributors</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              Super Admins
            </p>
            <p className="mt-2 text-3xl font-bold text-purple-400">{stats.superAdmins}</p>
            <p className="mt-1 text-xs text-slate-400">System controllers</p>
          </div>
        </section>

        {/* Users Table Card */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-6">
          {/* Search and Filters Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users by name or email..."
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200 focus:border-cyan-400 focus:outline-none placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
              >
                <option value="all">All Roles ({stats.total})</option>
                <option value="user">Applicants / Users ({stats.regularUsers})</option>
                <option value="admin">Admins ({stats.admins})</option>
                <option value="super_admin">Super Admins ({stats.superAdmins})</option>
              </select>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="py-16 text-center text-slate-400">Loading user database...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-800 py-16 text-center text-slate-400">
              <p className="text-base font-bold text-slate-300">No users found.</p>
              <p className="text-xs text-slate-500 mt-1">Try modifying your search or role filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-semibold">User</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                  {filteredUsers.map((u) => {
                    const role = u.role || "user";
                    const isSuper = role === "super_admin";
                    const isAdmin = role === "admin";

                    return (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-950 border border-cyan-800/60 text-sm font-bold text-cyan-300">
                              {u.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{u.name}</p>
                              <p className="text-xs text-slate-500">ID #{u.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-300 font-mono text-xs">
                          {u.email}
                        </td>
                        <td className="px-6 py-4">
                          {isSuper && (
                            <span className="inline-flex items-center rounded-full bg-purple-950 border border-purple-700/60 px-2.5 py-0.5 text-xs font-bold text-purple-300">
                              Super Admin
                            </span>
                          )}
                          {isAdmin && (
                            <span className="inline-flex items-center rounded-full bg-blue-950 border border-blue-700/60 px-2.5 py-0.5 text-xs font-bold text-blue-300">
                              Admin
                            </span>
                          )}
                          {!isSuper && !isAdmin && (
                            <span className="inline-flex items-center rounded-full bg-emerald-950 border border-emerald-700/60 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
                              Applicant / User
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : "Existing"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default SuperAdminUsers;
