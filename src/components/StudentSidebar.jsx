import React from "react";
import { Link, useLocation } from "react-router-dom";

const StudentSidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (path) => {
    if (path === "/Dashboard" && (pathname === "/Dashboard" || pathname === "/dashboard")) return true;
    return pathname.startsWith(path);
  };

  const navItems = [
    {
      title: "Dashboard",
      path: "/Dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9M9 5h6" />
        </svg>
      ),
    },
    {
      title: "Paragraph Reading",
      path: "/ParagraphReading",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: "Mock Interview",
      path: "/MockInterview",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "Practice History",
      path: "/PracticeHistory",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Performance Summary",
      path: "/PerformanceSummary",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-20 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-6 gap-6 fixed h-screen z-40">
      {/* Logo */}
      <Link to="/Dashboard" className="flex items-center justify-center group" title="BPOReady">
        <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-500/40 rounded-xl flex items-center justify-center text-cyan-400 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-all shadow-md shadow-cyan-950/40">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </Link>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-3">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link key={item.path} to={item.path} title={item.title}>
              <button
                className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all ${
                  active
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-md shadow-cyan-950/30 font-bold"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/80"
                }`}
              >
                {item.icon}
              </button>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile & Logout */}
      <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-slate-800">
        <Link to="/Profile" title="My Profile">
          <button
            className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all ${
              isActive("/Profile")
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-md shadow-cyan-950/30"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/80"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </Link>

        <Link to="/Login" title="Log Out">
          <button
            onClick={() => {
              localStorage.removeItem("user");
              localStorage.removeItem("token");
            }}
            className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </Link>
      </div>
    </aside>
  );
};

export default StudentSidebar;
