import React from "react";
import { Link } from "react-router-dom";

const MonitorUsers = () => {
  const users = [
    { id: 1, name: "Juan Dela Cruz", email: "juan@email.com" },
    { id: 2, name: "Maria Santos", email: "maria@email.com" },
    { id: 3, name: "Claudin Reyes", email: "claudin@email.com" },
    { id: 4, name: "Ana Lopez", email: "ana@email.com" },
  ];

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
            <button className="w-full text-left px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg">
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
      <div className="flex-1 ml-56 p-8 space-y-6">

        {/* Registered Users Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-1">Registered Users</h1>
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-semibold">Total Number of Registered Users:</span> 128
          </p>

          {/* Users Table */}
          <table className="w-full border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{user.name}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Two Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Average User Performance */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-3">Average User Performance</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              The average user performance in the system is currently evaluated as{" "}
              <span className="font-bold text-gray-800">Good</span> based on the overall results
              of paragraph reading and mock interview activities.
            </p>
          </div>

          {/* Common Speech Flaws */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-3">Common Speech Flaws</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-gray-500 rounded-full shrink-0"></span>
                <span><span className="font-semibold">Most Common Filler Words:</span> "uhm", "ah", "you know"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-gray-500 rounded-full shrink-0"></span>
                <span><span className="font-semibold">Common Pacing Issue:</span> Slightly Fast</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-gray-500 rounded-full shrink-0"></span>
                <span><span className="font-semibold">Common Voice Volume Issue:</span> Moderate to Low</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MonitorUsers;