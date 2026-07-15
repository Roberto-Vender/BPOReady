import React from "react";
import { Link } from "react-router-dom";

const ParagraphReading = () => {
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
            <button className="w-10 h-10 flex items-center justify-center text-blue-600 bg-blue-50 rounded-lg transition-colors">
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
          {/* Profile */}
          <Link to="/Profile" title="Profile">
            <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
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
        <div className="bg-white shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-800">Paragraph Reading Practice</h1>
          </div>
        </div>

        {/* Page Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Title Section */}
          <div className="text-center mb-12">
            <p className="text-lg text-gray-600">
              Complete each level to unlock the next one and improve your communication skills step by step.
            </p>
          </div>

          {/* Levels Grid */}
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* Easy Level */}
            <div className="flex items-center gap-8 p-6 rounded-xl border-2 bg-white border-gray-200 hover:shadow-lg transition-all">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm text-center p-2">
                  EASY
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-600 text-sm">
                  Practice simple sentences
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  to build basic fluency and confidence
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Status: <span className="text-green-600 font-semibold">Available</span>
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link to="/easy-level-paragraph-reading">
                  <button className="px-8 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-md">
                    Start
                  </button>
                </Link>
              </div>
            </div>

            {/* Medium Level */}
            <div className="flex items-center gap-8 p-6 rounded-xl border-2 bg-white border-gray-200 hover:shadow-lg transition-all">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm text-center p-2">
                  MEDIUM
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-600 text-sm">
                  Improve clarity and sentence structure
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  with moderate difficulty passages
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Status: <span className="text-green-600 font-semibold">Available</span>
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link to="/medium-level-paragraph-reading">
                  <button className="px-8 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-md">
                    Start
                  </button>
                </Link>
              </div>
            </div>

            {/* Hard Level */}
            <div className="flex items-center gap-8 p-6 rounded-xl border-2 bg-white border-gray-200 hover:shadow-lg transition-all">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-sm text-center p-2">
                  HARD
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-600 text-sm">
                  Advanced practice
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  designed to simulate real interview responses
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Status: <span className="text-green-600 font-semibold">Available</span>
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link to="/hard-level-paragraph-reading">
                  <button className="px-8 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-md">
                    Start
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParagraphReading;
      