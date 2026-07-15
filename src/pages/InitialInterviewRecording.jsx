import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { getQuestions } from "../utils/questionData";

const InitialInterviewRecording = () => {
  const { mock } = useMemo(() => getQuestions(), []);
  const question = mock.initial[0];

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
      <div className="flex-1 ml-20 flex items-center justify-center min-h-screen">
        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-lg mx-4">

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-800 text-center mb-6">
            Initial Interview - Question 1 of {mock.initial.length}
          </h2>

          {/* Question */}
          <div className="text-center mb-6">
            <p className="text-lg font-semibold text-gray-800 mb-1">{question?.question || "No question available yet."}</p>
            <p className="text-sm text-gray-400">Provide a clear and confident answer.</p>
          </div>

          {/* Mic Icon */}
          <div className="flex justify-center mb-6">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
            </svg>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 mb-6">
            <button className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors shadow-md">
              Stop Recording
            </button>
            
              <button className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-md">
                Next Question
              </button>
            
            <Link to="/MockInterviewFeedback">
            <button className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-md">
              Submit
            </button>
            </Link>
          </div>

          {/* Transcription Section */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">Your Answer (Transcription):</p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                My name is Claudin, I am a hardworking and adaptable individual with strong communication skills.
                I can handle customer concerns calmly and professionally, and I'm comfortable working in fast-paced
                environments. I'm also willing to learn and grow, which makes me a good fit for a BPO role.
              </p>
            </div>
          </div>

          {/* Next Question Button */}
          <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md">
            Next Questions
          </button>

        </div>
      </div>
    </div>
  );
};

export default InitialInterviewRecording;