import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const emptyForm = {
  name: "",
  email: "",
  recovery_email: "",
  password: "",
  password_confirmation: "",
  current_password: "",
};

const CreateAdminAccount = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/admin/accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...form, creator_email: user.email }),
      });
      const data = await response.json();

      if (!response.ok) {
        const validationErrors = data.errors ? Object.values(data.errors).flat().join(" ") : data.message;
        throw new Error(validationErrors || "Unable to create administrator account.");
      }

      setMessage(`${data.user.name} can now sign in through Admin Login.`);
      setForm(emptyForm);
    } catch (submitError) {
      setError(submitError.message || "Unable to create administrator account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 font-poppins text-slate-100">
      <div className="mx-auto max-w-3xl">
        <Link to="/SuperAdminDashboard" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300">&larr; Back to Super Admin dashboard</Link>
        <div className="mt-8 rounded-2xl border border-cyan-900/70 bg-slate-900 p-8 shadow-2xl shadow-cyan-950/20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">Administrator access</p>
          <h1 className="mt-2 text-3xl font-bold">Create Admin Account</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Create a regular administrator account. Confirm your current Super Admin password to authorize this action.</p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5 md:grid-cols-2">
            {message && <p className="md:col-span-2 rounded-lg border border-emerald-800 bg-emerald-950/50 px-4 py-3 text-sm text-emerald-300">{message}</p>}
            {error && <p className="md:col-span-2 rounded-lg border border-rose-900 bg-rose-950/50 px-4 py-3 text-sm text-rose-300">{error}</p>}
            
            <label className="text-sm font-semibold text-slate-300">
              Admin name
              <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 font-normal text-slate-100 outline-none focus:border-cyan-400" />
            </label>

            <label className="text-sm font-semibold text-slate-300">
              Admin email (Login ID)
              <input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 font-normal text-slate-100 outline-none focus:border-cyan-400" />
            </label>

            <label className="text-sm font-semibold text-slate-300 md:col-span-2">
              Recovery Gmail / Email (Optional)
              <input type="email" placeholder="e.g. admin.recovery@gmail.com" value={form.recovery_email} onChange={(event) => setForm({ ...form, recovery_email: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 font-normal text-slate-100 outline-none focus:border-cyan-400" />
              <span className="text-xs text-slate-500 font-normal mt-1 block">Account recovery codes will be delivered to this address.</span>
            </label>

            <label className="text-sm font-semibold text-slate-300">
              Temporary password
              <input required minLength="8" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 font-normal text-slate-100 outline-none focus:border-cyan-400" />
            </label>

            <label className="text-sm font-semibold text-slate-300">
              Confirm password
              <input required minLength="8" type="password" value={form.password_confirmation} onChange={(event) => setForm({ ...form, password_confirmation: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 font-normal text-slate-100 outline-none focus:border-cyan-400" />
            </label>

            <label className="text-sm font-semibold text-slate-300 md:col-span-2">
              Your current Super Admin password
              <input required type="password" value={form.current_password} onChange={(event) => setForm({ ...form, current_password: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 font-normal text-slate-100 outline-none focus:border-cyan-400 md:max-w-xl" />
            </label>

            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button type="submit" disabled={isSubmitting} className="rounded-lg bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60">
                {isSubmitting ? "Creating account..." : "Create admin account"}
              </button>
              <button type="button" onClick={() => navigate("/SuperAdminDashboard")} className="rounded-lg border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAdminAccount;
