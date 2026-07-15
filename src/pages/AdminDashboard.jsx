import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
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
            <button className="w-full text-left px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg">
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
            <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
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
      <div className="flex-1 ml-56 p-8">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            This dashboard presents an overview of registered users, overall performance, and common speech issues in the system.
          </p>
        </div>

        <hr className="border-gray-300 mb-6" />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Registered Users */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-xs text-gray-500 mb-2">Total Registered Users</p>
            <p className="text-3xl font-bold text-gray-800">128</p>
          </div>

          {/* Average User Performance */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-xs text-gray-500 mb-2">Average User Performance</p>
            <p className="text-3xl font-bold text-blue-600">Good</p>
          </div>

          {/* Most Common Speech Flaw */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-xs text-gray-500 mb-2">Most Common Speech Flaw</p>
            <p className="text-3xl font-bold text-blue-600">Filler Words</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;