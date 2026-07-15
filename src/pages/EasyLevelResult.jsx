import React from "react";
import { Link } from "react-router-dom";

const EasyLevelResult = () => {
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
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Easy Level - Paragraph Reading</h1>
            <button className="text-gray-600 hover:text-gray-800">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Speech Analysis Result Card */}
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Speech Analysis Result</h2>

            {/* Speech Analysis Summary */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Speech Analysis Summary:</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Filler Words:</span>
                  <span className="font-semibold text-gray-800">"uhm" (3), "you know" (1)</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Total Words:</span>
                  <span className="font-semibold text-gray-800">87</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Confidence:</span>
                  <span className="font-semibold text-gray-800">Moderate</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pacing:</span>
                  <span className="font-semibold text-gray-800">Slightly Fast</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="my-8" />

            {/* Suggestions for Improvement */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Suggestions for Improvement:</h3>
              <ul className="space-y-3 list-disc list-inside">
                <li className="text-gray-700">Minimize the use of filler words to improve fluency</li>
                <li className="text-gray-700">Maintain a steady and controlled speaking pace</li>
                <li className="text-gray-700">Focus on clear pronunciation of each word</li>
                <li className="text-gray-700">Practice regularly to build confidence in reading aloud</li>
              </ul>
            </div>

            {/* Feedback Message */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-10">
              <p className="text-gray-800">
                Thank you for completing the paragraph reading activity. Overall, your delivery is clear and understandable, and you were able to read the passage with a reasonable level of confidence. Your pronunciation is generally accurate, which helps maintain clarity. However, there are instances where filler words such as "uhm" and "um" were used, which slightly affect the smoothness of your delivery. Your pacing is also slightly fast in some parts, which may make it harder for listeners to fully understand you speech.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Link to="/easy-level-paragraph-reading">
                <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                  Retry Easy Level
                </button>
              </Link>
              <Link to="/medium-level-paragraph-reading">
                <button className="px-8 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors shadow-md">
                  Proceed to Medium Level
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EasyLevelResult;
