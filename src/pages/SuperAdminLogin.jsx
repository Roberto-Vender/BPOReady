import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SuperAdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        const validationErrors = data.errors ? Object.values(data.errors).flat().join(" ") : data.message;
        throw new Error(validationErrors || "Unable to log in as Super Admin.");
      }

      if (data.user.role !== "super_admin") {
        throw new Error("This account does not have Super Admin access.");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/SuperAdminDashboard");
    } catch (submitError) {
      setError(submitError.message || "Unable to log in as Super Admin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 font-poppins text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center">
        <div className="w-full rounded-2xl border border-cyan-900/70 bg-slate-900 p-8 shadow-2xl shadow-cyan-950/30">
          <div className="mb-8">
            <Link to="/" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300">&larr; Back to home</Link>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">BPOReady control center</p>
            <h1 className="mt-2 text-3xl font-bold">Super Admin Login</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">Sign in with your Super Admin account to manage the entire platform.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <p className="rounded-lg border border-rose-900 bg-rose-950/50 px-4 py-3 text-sm text-rose-300">{error}</p>}
            <div>
              <label htmlFor="super-admin-email" className="mb-2 block text-sm font-semibold text-slate-300">Email address</label>
              <input
                id="super-admin-email"
                name="email"
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="admin@bpoready.com"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>
            <div>
              <label htmlFor="super-admin-password" className="mb-2 block text-sm font-semibold text-slate-300">Password</label>
              <input
                id="super-admin-password"
                name="password"
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-cyan-400 px-4 py-3 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? "Signing in..." : "Sign in as Super Admin"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Regular administrator? <Link to="/AdminLogin" className="font-semibold text-cyan-400 hover:text-cyan-300">Use Admin Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
