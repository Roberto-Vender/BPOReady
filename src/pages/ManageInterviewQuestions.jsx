import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getQuestions, saveQuestions } from "../utils/questionData";

const initialParagraphQuestions = {
  easy: [
    { id: 1, question: "Tell me about yourself." },
    { id: 2, question: "Why do you want to work in the BPO industry?" },
  ],
  medium: [
    { id: 3, question: "How do you handle difficult customers?" },
    { id: 4, question: "How do you manage stress in a fast-paced environment?" },
  ],
  hard: [
    { id: 5, question: "Describe a situation where you had to resolve a conflict at work." },
  ],
};

const initialMockQuestions = {
  initial: [
    { id: 101, question: "Tell me about yourself." },
    { id: 102, question: "Why should we hire you?" },
  ],
  final: [
    { id: 201, question: "Describe a time you handled a difficult customer." },
  ],
};

const paragraphLevels = [
  { key: "easy", label: "Easy" },
  { key: "medium", label: "Medium" },
  { key: "hard", label: "Hard" },
];

const mockLevels = [
  { key: "initial", label: "Initial Interview" },
  { key: "final", label: "Final Interview" },
];

const ManageInterviewQuestions = () => {
  const storedQuestions = useMemo(() => getQuestions(), []);
  const [paragraphQuestions, setParagraphQuestions] = useState(storedQuestions.paragraph);
  const [mockQuestions, setMockQuestions] = useState(storedQuestions.mock);
  const [selectedLevel, setSelectedLevel] = useState("easy");
  const [selectedSection, setSelectedSection] = useState("paragraph");
  const [insertAfterId, setInsertAfterId] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    saveQuestions({ paragraph: paragraphQuestions, mock: mockQuestions });
  }, [paragraphQuestions, mockQuestions]);

  const handleAddQuestion = (e) => {
    e.preventDefault();

    const trimmedQuestion = newQuestion.trim();
    if (!trimmedQuestion) {
      setMessage("Please enter a question before saving.");
      return;
    }

    if (selectedSection === "paragraph") {
      const currentQuestions = paragraphQuestions[selectedLevel];
      const insertIndex = insertAfterId
        ? currentQuestions.findIndex((item) => item.id === Number(insertAfterId))
        : -1;

      const newEntry = { id: Date.now(), question: trimmedQuestion };
      const updatedQuestions = [...currentQuestions];

      if (insertIndex >= 0) {
        updatedQuestions.splice(insertIndex + 1, 0, newEntry);
      } else {
        updatedQuestions.push(newEntry);
      }

      setParagraphQuestions((prev) => ({
        ...prev,
        [selectedLevel]: updatedQuestions,
      }));

      setMessage(`Added to the ${paragraphLevels.find((level) => level.key === selectedLevel)?.label.toLowerCase()} paragraph list.`);
    } else {
      const currentQuestions = mockQuestions[selectedLevel];
      const insertIndex = insertAfterId
        ? currentQuestions.findIndex((item) => item.id === Number(insertAfterId))
        : -1;

      const newEntry = { id: Date.now(), question: trimmedQuestion };
      const updatedQuestions = [...currentQuestions];

      if (insertIndex >= 0) {
        updatedQuestions.splice(insertIndex + 1, 0, newEntry);
      } else {
        updatedQuestions.push(newEntry);
      }

      setMockQuestions((prev) => ({
        ...prev,
        [selectedLevel]: updatedQuestions,
      }));

      setMessage(`Added to the ${mockLevels.find((level) => level.key === selectedLevel)?.label.toLowerCase()} list.`);
    }

    setNewQuestion("");
    setInsertAfterId("");
    setShowForm(false);
  };

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
            <button className="w-full text-left px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg">
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
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Page Title */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-800">Manage Questions</h1>
            <button
              onClick={() => setShowForm((prev) => !prev)}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showForm ? "Close Form" : "Add Question"}
            </button>
          </div>

          {message && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          )}

          {/* Add Question Form */}
          {showForm && (
            <form onSubmit={handleAddQuestion} className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Choose section
                  </label>
                  <select
                    value={selectedSection}
                    onChange={(e) => {
                      setSelectedSection(e.target.value);
                      setSelectedLevel(e.target.value === "paragraph" ? "easy" : "initial");
                      setInsertAfterId("");
                    }}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-400"
                  >
                    <option value="paragraph">Paragraph Reading</option>
                    <option value="mock">Mock Interview</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Choose level
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => {
                      setSelectedLevel(e.target.value);
                      setInsertAfterId("");
                    }}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-400"
                  >
                    {(selectedSection === "paragraph" ? paragraphLevels : mockLevels).map((level) => (
                      <option key={level.key} value={level.key}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Add after question
                </label>
                <select
                  value={insertAfterId}
                  onChange={(e) => setInsertAfterId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-400"
                >
                  <option value="">At the end of the list</option>
                  {(selectedSection === "paragraph" ? paragraphQuestions[selectedLevel] : mockQuestions[selectedLevel]).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.question}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Question text
                </label>
                <textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Enter the new question"
                  rows={4}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Save Question
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setNewQuestion("");
                    setInsertAfterId("");
                  }}
                  className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Question List */}
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-800">Paragraph Reading Questions</h2>
              </div>
              <div className="space-y-3">
                {paragraphLevels.map((level) => (
                  <div key={level.key}>
                    <h3 className="mb-2 text-sm font-semibold text-gray-700">{level.label}</h3>
                    <ul className="space-y-2">
                      {paragraphQuestions[level.key].map((item) => (
                        <li key={item.id} className="rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                          {item.question}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-800">Mock Interview Questions</h2>
              </div>
              <div className="space-y-3">
                {mockLevels.map((level) => (
                  <div key={level.key}>
                    <h3 className="mb-2 text-sm font-semibold text-gray-700">{level.label}</h3>
                    <ul className="space-y-2">
                      {mockQuestions[level.key].map((item) => (
                        <li key={item.id} className="rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                          {item.question}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageInterviewQuestions;