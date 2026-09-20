import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SuperAdminProfile = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    recovery_email: user?.recovery_email || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (!user?.email) return;

    fetch(`${apiUrl}/api/profile?email=${encodeURIComponent(user.email)}`, {
      headers: { Accept: "application/json" },
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load profile.");
        return data.user;
      })
      .then((freshUser) => {
        setUser(freshUser);
        setProfileForm({
          name: freshUser.name || "",
          recovery_email: freshUser.recovery_email || "",
        });
        localStorage.setItem("user", JSON.stringify(freshUser));
      })
      .catch((loadError) => setError(loadError.message));
  }, [apiUrl, user?.email]);

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsSavingProfile(true);

    try {
      const response = await fetch(`${apiUrl}/api/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: user.email,
          name: profileForm.name,
          recovery_email: profileForm.recovery_email.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to update profile.");

      setUser(data.user);
      setProfileForm({
        name: data.user.name || "",
        recovery_email: data.user.recovery_email || "",
      });
      localStorage.setItem("user", JSON.stringify(data.user));
      setMessage("Super Admin profile and recovery email updated successfully!");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (passwordForm.password !== passwordForm.password_confirmation) {
      setError("New password and confirmation do not match.");
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await fetch(`${apiUrl}/api/profile/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: user.email, ...passwordForm }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to update password.");

      setPasswordForm({ current_password: "", password: "", password_confirmation: "" });
      setMessage("Password updated successfully!");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/AdminLogin");
  };

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
                className="rounded-lg px-3 py-2 text-slate-400 hover:text-slate-200 transition"
              >
                User List
              </Link>
              <Link
                to="/SuperAdminProfile"
                className="rounded-lg bg-slate-800 px-3 py-2 font-semibold text-cyan-400 border border-slate-700"
              >
                Profile
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

      <main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        {/* Title Header Card */}
        <section className="rounded-2xl border border-cyan-900/60 bg-linear-to-br from-cyan-950 to-slate-900 p-8 shadow-2xl shadow-cyan-950/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Account Settings & Security
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
                Super Admin Profile
              </h1>
              <p className="mt-2 max-w-xl text-sm text-slate-300">
                Manage your credentials, configure your recovery Gmail address, and securely change your administrator password.
              </p>
            </div>
            <div className="rounded-xl border border-cyan-800/80 bg-slate-950/60 px-5 py-4">
              <p className="text-xs uppercase tracking-wider text-slate-400">Account Role</p>
              <p className="mt-1 font-bold text-purple-300">Super Administrator</p>
              <p className="text-xs text-emerald-400 font-semibold mt-1">Full System Authority</p>
            </div>
          </div>
        </section>

        {/* Success / Error Alerts */}
        {(message || error) && (
          <div
            className={`rounded-xl border p-4 text-sm flex items-center justify-between ${
              error
                ? "border-rose-800/70 bg-rose-950/50 text-rose-200"
                : "border-emerald-800/70 bg-emerald-950/50 text-emerald-200"
            }`}
          >
            <span>{error || message}</span>
            <button
              type="button"
              onClick={() => {
                setMessage("");
                setError("");
              }}
              className="text-xs font-bold uppercase hover:underline ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Account Details Overview */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-cyan-300">Account Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <span className="text-slate-500 uppercase tracking-wider block mb-1 font-semibold">
                Super Admin Name
              </span>
              <p className="text-sm font-bold text-white truncate">{user?.name || "Super Admin"}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <span className="text-slate-500 uppercase tracking-wider block mb-1 font-semibold">
                Primary Login Email
              </span>
              <p className="text-sm font-bold text-white truncate">{user?.email || "admin@bpoready.com"}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-500 uppercase tracking-wider font-semibold">
                  Recovery Gmail / Email
                </span>
                {user?.recovery_email ? (
                  <span className="rounded bg-emerald-950 border border-emerald-700/60 px-1.5 py-0.2 text-[10px] font-bold text-emerald-300">
                    Active
                  </span>
                ) : (
                  <span className="rounded bg-amber-950 border border-amber-700/60 px-1.5 py-0.2 text-[10px] font-bold text-amber-300">
                    Using Primary
                  </span>
                )}
              </div>
              <p className="text-sm font-bold text-white truncate">
                {user?.recovery_email || "Not configured yet"}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                {user?.recovery_email
                  ? "Recovery codes will route here."
                  : "Add below to route recovery codes to a dedicated Gmail."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Update Details Form Card */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-cyan-300">Update Profile Details</h2>
              <p className="text-xs text-slate-400">Change your display name and recovery email.</p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  required
                  placeholder="Enter full name"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-200 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Login Email (Account ID)
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  disabled
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/50 px-3.5 py-2.5 text-sm text-slate-400 cursor-not-allowed"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Email is locked to your Super Admin credential.
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Recovery Gmail / Email
                  </label>
                  <span className="text-[10px] text-cyan-400 font-medium">Account Recovery</span>
                </div>
                <input
                  name="recovery_email"
                  type="email"
                  value={profileForm.recovery_email}
                  onChange={handleProfileChange}
                  placeholder="e.g. superadmin.recovery@gmail.com"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-200 focus:border-cyan-400 focus:outline-none"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Password reset codes for your Super Admin account will be sent to this address.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full rounded-lg bg-cyan-400 py-2.5 text-sm font-bold text-slate-950 hover:bg-cyan-300 transition shadow-md shadow-cyan-950/40 disabled:opacity-60"
              >
                {isSavingProfile ? "Saving Changes..." : "Save Profile Details"}
              </button>
            </form>
          </section>

          {/* Change Password Form Card */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-cyan-300">Change Password</h2>
              <p className="text-xs text-slate-400">Ensure your account uses a secure password.</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Current Password
                </label>
                <input
                  name="current_password"
                  type="password"
                  value={passwordForm.current_password}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Enter current password"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-200 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  New Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={passwordForm.password}
                  onChange={handlePasswordChange}
                  minLength={8}
                  required
                  placeholder="Enter new password (min 8 chars)"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-200 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  name="password_confirmation"
                  type="password"
                  value={passwordForm.password_confirmation}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Confirm new password"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-200 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full rounded-lg bg-cyan-400 py-2.5 text-sm font-bold text-slate-950 hover:bg-cyan-300 transition shadow-md shadow-cyan-950/40 disabled:opacity-60"
              >
                {isChangingPassword ? "Updating Password..." : "Update Password"}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminProfile;
