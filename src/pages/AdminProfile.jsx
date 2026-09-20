import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

const AdminProfile = () => {
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
      setMessage("Profile details and recovery email updated successfully!");
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

  return (
    <div className="flex min-h-screen bg-slate-950 font-poppins text-slate-100">
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-60">
        <header className="bg-slate-900/90 border-b border-slate-800 px-8 py-4 sticky top-0 z-30 backdrop-blur-md">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Admin Profile</h1>
              <p className="text-xs text-slate-400">Manage your credentials, recovery settings, and administrator profile.</p>
            </div>
            <span className="rounded-full bg-blue-950 border border-blue-800 px-3 py-0.5 text-xs font-semibold text-blue-300">
              Admin Portal
            </span>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-8 py-10 space-y-6">
          {(message || error) && (
            <div
              className={`rounded-xl border p-4 text-xs font-semibold flex items-center justify-between ${
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
                className="text-xs uppercase hover:underline ml-4 font-bold"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Profile Information */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-cyan-300">Account Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <span className="text-slate-500 uppercase tracking-wider block mb-1 font-semibold">
                  Admin Name
                </span>
                <p className="text-sm font-bold text-white truncate">{user?.name || "Admin"}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <span className="text-slate-500 uppercase tracking-wider block mb-1 font-semibold">
                  Admin Email
                </span>
                <p className="text-sm font-bold text-white truncate">{user?.email || "admin@bpoready.com"}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-500 uppercase tracking-wider font-semibold">
                    Recovery Email
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

          {/* Forms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Update Profile & Recovery Email */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-cyan-300">Update Profile Details</h3>
                <p className="text-xs text-slate-400">Change your administrator name and recovery Gmail.</p>
              </div>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    required
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Recovery Gmail / Email
                    </label>
                    <span className="text-[10px] text-cyan-400 font-medium">Account Recovery</span>
                  </div>
                  <input
                    name="recovery_email"
                    type="email"
                    value={profileForm.recovery_email}
                    onChange={handleProfileChange}
                    placeholder="e.g. admin.recovery@gmail.com"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Password recovery codes will be delivered to this email address.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="w-full rounded-lg bg-cyan-400 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition shadow-md shadow-cyan-950/40 disabled:opacity-60"
                >
                  {isSavingProfile ? "Saving..." : "Save Profile Details"}
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-cyan-300">Change Password</h3>
                <p className="text-xs text-slate-400">Ensure your account uses a secure password.</p>
              </div>
              <form onSubmit={handlePasswordSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Current Password
                  </label>
                  <input
                    name="current_password"
                    type="password"
                    value={passwordForm.current_password}
                    onChange={handlePasswordChange}
                    required
                    placeholder="Current password"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    New Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={passwordForm.password}
                    onChange={handlePasswordChange}
                    minLength={8}
                    required
                    placeholder="New password (min 8 chars)"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Confirm Password
                  </label>
                  <input
                    name="password_confirmation"
                    type="password"
                    value={passwordForm.password_confirmation}
                    onChange={handlePasswordChange}
                    required
                    placeholder="Confirm new password"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full rounded-lg bg-cyan-400 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition shadow-md shadow-cyan-950/40 disabled:opacity-60"
                >
                  {isChangingPassword ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProfile;