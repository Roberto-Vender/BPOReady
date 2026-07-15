import React from "react";
import { Link } from "react-router-dom";

const MockInterviewFeedback = () => {
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

          {/* Mock Interview - Active */}
          <Link to="/MockInterview" title="Mock Interview">
            <button className="w-10 h-10 flex items-center justify-center text-blue-600 bg-blue-50 rounded-lg transition-colors">
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
      <div className="flex-1 ml-20 flex items-center justify-center min-h-screen py-10">
        {/* Feedback Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl mx-4">

          {/* Header Row */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Mock Interview Feedback</h2>
            <Link to="/MockInterview">
              <button className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-sm">
                Back to Mock Interview Menu
              </button>
            </Link>
          </div>

          {/* Speech Analysis Summary */}
          <div className="mb-6">
            <p className="text-sm font-bold text-gray-800 mb-2">Speech Analysis Summary:</p>
            <div className="space-y-1 text-sm text-gray-700">
              <p><span className="font-semibold">Filler Words:</span> "uhm" (3), "you know" (1)</p>
              <p><span className="font-semibold">Clarity:</span> Good</p>
              <p><span className="font-semibold">Confidence:</span> Moderate</p>
              <p><span className="font-semibold">Pacing:</span> Slightly Fast</p>
            </div>
          </div>

          {/* Overall Feedback */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 leading-relaxed">
              Thank you for completing the mock interview session. Overall, you demonstrated a good understanding of
              the questions and provided relevant responses. However, there were instances where filler words were
              used, which may affect the smoothness of your delivery. Improving your pacing and organizing your
              thoughts before answering can help enhance your communication.
            </p>
          </div>

          {/* Suggestions for Improvement */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-8">
            <p className="text-sm font-semibold text-gray-800 mb-3">Suggestions for Improvement:</p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 bg-gray-500 rounded-full flex-shrink-0"></span>
                Avoid filler words such as "uhm" and "you know"
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 bg-gray-500 rounded-full flex-shrink-0"></span>
                Maintain a steady speaking pace
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 bg-gray-500 rounded-full flex-shrink-0"></span>
                Speak clearly and confidently
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 bg-gray-500 rounded-full flex-shrink-0"></span>
                Organize your answers before responding
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link to="/InitialInterview" className="flex-1">
              <button className="w-full py-3 bg-blue-200 text-blue-700 font-semibold rounded-lg hover:bg-blue-300 transition-colors">
                Retry Interview
              </button>
            </Link>
            <Link to="/MockInterview" className="flex-1">
              <button className="w-full py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors shadow-md">
                Start New Interview Session
              </button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MockInterviewFeedback;