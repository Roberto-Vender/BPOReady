import React from "react";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (path) => pathname === path;

  const links = [
    { label: "Dashboard", path: "/AdminDashboard" },
    { label: "Manage Interview Questions", path: "/ManageInterviewQuestions" },
    { label: "Monitor Users", path: "/MonitorUsers" },
    { label: "Profile", path: "/AdminProfile" },
  ];

  return (
    <aside className="w-60 bg-slate-900 border-r border-slate-800 flex flex-col py-6 fixed h-screen z-30 font-poppins">
      {/* Logo */}
      <div className="px-6 mb-8 flex items-center justify-between">
        <Link to="/AdminDashboard" className="flex items-center gap-2">
          <span className="text-xl font-bold text-cyan-400">BPOReady</span>
          <span className="rounded bg-blue-950 border border-blue-700/60 px-2 py-0.5 text-[10px] font-bold text-blue-300 uppercase">
            Admin
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-1.5 px-3 flex-1">
        {links.map((item) => {
          const active = isActive(item.path);
          return (
            <Link key={item.path} to={item.path}>
              <button
                className={`w-full text-left px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                  active
                    ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-xs"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/80"
                }`}
              >
                {item.label}
              </button>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto px-3 pt-4 border-t border-slate-800">
        <Link to="/Login">
          <button
            onClick={() => {
              localStorage.removeItem("user");
              localStorage.removeItem("token");
            }}
            className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-all"
          >
            Log out
          </button>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
