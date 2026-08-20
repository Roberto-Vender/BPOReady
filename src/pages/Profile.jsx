import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [profileForm, setProfileForm] = useState({ name: user?.name || "" });
  const [passwordForm, setPasswordForm] = useState({ current_password: "", password: "", password_confirmation: "" });
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
        if (!response.ok) throw new Error(data.message || "Unable to load your profile.");
        return data.user;
      })
      .then((freshUser) => {
        setUser(freshUser);
        setProfileForm({ name: freshUser.name });
        localStorage.setItem("user", JSON.stringify(freshUser));
      })
      .catch((loadError) => setError(loadError.message));
  }, [apiUrl, user?.email]);

  const handleProfileChange = (event) => {
    setProfileForm({ ...profileForm, [event.target.name]: event.target.value });
  };

  const handlePasswordChange = (event) => {
    setPasswordForm({ ...passwordForm, [event.target.name]: event.target.value });
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSavingProfile(true);

    try {
      const response = await fetch(`${apiUrl}/api/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: user.email, name: profileForm.name }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to update your profile.");

      setUser(data.user);
      setProfileForm({ name: data.user.name });
      localStorage.setItem("user", JSON.stringify(data.user));
      setMessage(data.message);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (passwordForm.password !== passwordForm.password_confirmation) {
      setError("New passwords do not match.");
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
      if (!response.ok) throw new Error(data.message || "Unable to update your password.");

      setPasswordForm({ current_password: "", password: "", password_confirmation: "" });
      setMessage(data.message);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-poppins">
      {/* Sidebar */}
      <div className="w-20 bg-white border-r border-gray-200 shadow-sm flex flex-col items-center py-6 gap-6 fixed h-screen">
        {/* Logo */}
        <Link to="/Dashboard" className="flex items-center justify-center">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </Link>

        {/* Navigation Icons */}
        <nav className="flex flex-col gap-4">
          {/* Dashboard */}
          <Link to="/Dashboard" title="Dashboard">
            <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9M9 5h6" />
              </svg>
            </button>
          </Link>

          {/* Paragraph Reading */}
          <Link to="/ParagraphReading" title="Paragraph Reading">
            <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </Link>

          {/* Mock Interview */}
          <Link to="/MockInterview" title="Mock Interview">
            <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </Link>

          {/* Practice History */}
          <Link to="/PracticeHistory" title="Practice History">
            <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </Link>

          {/* Performance Summary */}
          <Link to="/PerformanceSummary" title="Performance Summary">
            <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
          </Link>
        </nav>

        {/* Bottom Icons */}
        <div className="mt-auto flex flex-col gap-4 pt-6 border-t border-gray-200">
          {/* Profile - Active */}
          <Link to="/Profile" title="Profile">
            <button className="w-10 h-10 flex items-center justify-center text-blue-600 bg-blue-50 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </Link>

          {/* Logout */}
          <Link to="/Login" title="Log Out">
            <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-20">
        {/* Header */}
        <div className="bg-gray-100 border-b border-gray-200 px-6 py-4">
          <h1 className="text-xl font-bold text-gray-800">My Profile</h1>
        </div>

        {/* Page Content */}
        <div className="px-6 py-6 max-w-3xl space-y-6">
          {(message || error) && (
            <p className={`rounded-lg px-4 py-3 text-sm ${error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
              {error || message}
            </p>
          )}

          {/* Account Information */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
              <h2 className="text-sm font-semibold text-gray-700">Account Information</h2>
            </div>
            <div className="px-6 py-4 space-y-2">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Name:</span> {user?.name || "Loading..."}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Email:</span> {user?.email || "Loading..."}
              </p>
            </div>
          </div>

          {/* Update Profile */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
              <h2 className="text-sm font-semibold text-gray-700">Update Profile</h2>
            </div>
            <form onSubmit={handleProfileSubmit} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Full Name</label>
                <input
                  name="name"
                  type="text"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-400"
                />
              </div>
              <button type="submit" disabled={isSavingProfile} className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 disabled:opacity-60 transition-colors">
                {isSavingProfile ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
              <h2 className="text-sm font-semibold text-gray-700">Change Password</h2>
            </div>
            <form onSubmit={handlePasswordSubmit} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Current Password</label>
                <input
                  name="current_password"
                  type="password"
                  value={passwordForm.current_password}
                  onChange={handlePasswordChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">New Password</label>
                <input
                  name="password"
                  type="password"
                  value={passwordForm.password}
                  onChange={handlePasswordChange}
                  minLength={8}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
                <input
                  name="password_confirmation"
                  type="password"
                  value={passwordForm.password_confirmation}
                  onChange={handlePasswordChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <button type="submit" disabled={isChangingPassword} className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 disabled:opacity-60 transition-colors">
                {isChangingPassword ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;