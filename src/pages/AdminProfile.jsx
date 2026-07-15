import React from "react";
import { Link } from "react-router-dom";

const AdminProfile = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 font-poppins">
      {/* Sidebar */}
      <div className="w-56 bg-white border-r border-gray-200 shadow-sm flex flex-col py-6 fixed h-screen">
        {/* Logo */}
        <div className="px-6 mb-8">
          <span className="text-xl font-bold text-blue-600">BPOReady</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 px-3">
          <Link to="/AdminDashboard">
            <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              Dashboard
            </button>
          </Link>
          <Link to="/ManageInterviewQuestions">
            <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              Manage Interview Questions
            </button>
          </Link>
          <Link to="/MonitorUsers">
            <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              Monitor Users
            </button>
          </Link>
          <Link to="/AdminProfile">
            <button className="w-full text-left px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg">
              Profile
            </button>
          </Link>
        </nav>

        {/* Logout */}
        <div className="mt-auto px-3">
          <Link to="/Login">
            <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              Log out
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-56 p-8 space-y-6">

        {/* Profile Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-4">Profile Information</h1>
          <div className="space-y-1 text-sm text-gray-700">
            <p><span className="font-semibold">Name:</span> Admin User</p>
            <p><span className="font-semibold">Email:</span> admin@bpoready.com</p>
          </div>
        </div>

        {/* Update Profile + Change Password side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Update Profile */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4">Update Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  defaultValue="Admin User"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue="admin@bpoready.com"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-400"
                />
              </div>
              <button className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <button className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition-colors">
                Update Password
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminProfile;