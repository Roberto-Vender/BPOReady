import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import {
  fetchAdminQuestions,
  fetchLiveQuestions,
  submitQuestionApi,
  updateQuestionStatusApi,
  deleteQuestionApi,
} from "../utils/questionData";

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
  const navigate = useNavigate();
  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const isSuperAdmin = currentUser?.role === "super_admin";

  const [questions, setQuestions] = useState([]);
  const [counts, setCounts] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(isSuperAdmin ? "pending" : "approved");
  const [selectedSection, setSelectedSection] = useState("paragraph");
  const [selectedLevel, setSelectedLevel] = useState("easy");
  const [newQuestion, setNewQuestion] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Rejection modal state
  const [rejectingQuestionId, setRejectingQuestionId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminQuestions();
      setQuestions(data.questions || []);
      setCounts(data.counts || { total: 0, pending: 0, approved: 0, rejected: 0 });
      fetchLiveQuestions().catch(() => {});
    } catch (err) {
      console.error("Unable to load questions from backend", err);
      setMessage({ type: "error", text: "Could not connect to questions service." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    const trimmedQuestion = newQuestion.trim();
    if (!trimmedQuestion) {
      setMessage({ type: "error", text: "Please enter a valid question prompt." });
      return;
    }

    try {
      const payload = {
        section: selectedSection,
        level: selectedLevel,
        question: trimmedQuestion,
        role: currentUser?.role || "admin",
        submitter_name: currentUser?.name || "Admin",
        submitter_email: currentUser?.email || "admin@bpoready.com",
      };

      const res = await submitQuestionApi(payload);
      setMessage({ type: "success", text: res.message || "Question submitted successfully!" });
      setNewQuestion("");
      setShowForm(false);
      await loadQuestions();

      if (!isSuperAdmin) {
        setActiveTab("my_submissions");
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to submit question." });
    }
  };

  const handleApproveQuestion = async (id) => {
    try {
      const res = await updateQuestionStatusApi(id, {
        status: "approved",
        reviewer_name: currentUser?.name || "Super Admin",
      });
      setMessage({ type: "success", text: res.message || "Question approved and published live!" });
      await loadQuestions();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to approve question." });
    }
  };

  const handleOpenRejectModal = (id) => {
    setRejectingQuestionId(id);
    setRejectionReason("");
  };

  const handleConfirmReject = async () => {
    if (!rejectingQuestionId) return;
    try {
      const res = await updateQuestionStatusApi(rejectingQuestionId, {
        status: "rejected",
        reviewer_name: currentUser?.name || "Super Admin",
        rejection_reason: rejectionReason.trim() || "Question does not meet standard BPO requirements.",
      });
      setMessage({ type: "success", text: res.message || "Question marked as rejected." });
      setRejectingQuestionId(null);
      setRejectionReason("");
      await loadQuestions();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to reject question." });
    }
  };

  const handleDeleteQuestion = async (id, questionText) => {
    if (!window.confirm(`Are you sure you want to delete this question?\n\n"${questionText}"`)) {
      return;
    }
    try {
      const res = await deleteQuestionApi(id);
      setMessage({ type: "success", text: res.message || "Question deleted successfully." });
      await loadQuestions();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to delete question." });
    }
  };

  const filteredQuestions = useMemo(() => {
    if (activeTab === "pending") {
      return questions.filter((q) => q.status === "pending");
    }
    if (activeTab === "approved") {
      return questions.filter((q) => q.status === "approved");
    }
    if (activeTab === "rejected") {
      return questions.filter((q) => q.status === "rejected");
    }
    if (activeTab === "my_submissions") {
      return questions.filter(
        (q) =>
          q.submitted_by_email === currentUser?.email ||
          q.submitted_by_name === currentUser?.name
      );
    }
    return questions;
  }, [questions, activeTab, currentUser]);

  return (
    <div className="flex min-h-screen bg-slate-950 font-poppins text-slate-100">
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-60">
        <header className="bg-slate-900/90 border-b border-slate-800 px-8 py-4 sticky top-0 z-30 backdrop-blur-md">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Manage Practice Questions</h1>
              <p className="text-xs text-slate-400">
                Submit questions for Super Admin approval and view active practice items.
              </p>
            </div>
            <span className="rounded-full bg-blue-950 border border-blue-800 px-3 py-0.5 text-xs font-semibold text-blue-300">
              Admin Portal
            </span>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-8 py-10 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl space-y-6">
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">Question Directory</h2>
                  <span className="rounded-full bg-blue-950 border border-blue-700/60 px-3 py-0.5 text-xs font-bold text-blue-300 uppercase">
                    Admin Contributor
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Submit new interview and reading questions. Submitted questions will be reviewed and approved by Super Admin.
                </p>
              </div>

              <button
                onClick={() => setShowForm((prev) => !prev)}
                className="rounded-xl bg-cyan-400 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition shadow-md shadow-cyan-950/40 self-start sm:self-auto"
              >
                <span>{showForm ? "✕ Close Form" : "+ Submit Question"}</span>
              </button>
            </div>

            {/* Alert Messages */}
            {message.text && (
              <div
                className={`rounded-xl border p-4 text-xs font-semibold flex items-center justify-between ${
                  message.type === "error"
                    ? "border-rose-800/70 bg-rose-950/50 text-rose-200"
                    : "border-emerald-800/70 bg-emerald-950/50 text-emerald-200"
                }`}
              >
                <span>{message.text}</span>
                <button
                  type="button"
                  onClick={() => setMessage({ type: "", text: "" })}
                  className="text-xs uppercase hover:underline ml-4 font-bold"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Add / Submit Question Form */}
            {showForm && (
              <form
                onSubmit={handleAddQuestion}
                className="rounded-xl border border-cyan-800/70 bg-slate-950 p-6 shadow-inner space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-cyan-300">
                    Submit Question for Super Admin Approval
                  </h3>
                  <span className="text-xs font-semibold text-amber-300 bg-amber-950/80 border border-amber-800 px-2.5 py-0.5 rounded-full">
                    Status: Pending Review
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Section
                    </label>
                    <select
                      value={selectedSection}
                      onChange={(e) => {
                        setSelectedSection(e.target.value);
                        setSelectedLevel(e.target.value === "paragraph" ? "easy" : "initial");
                      }}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="paragraph">Paragraph Reading</option>
                      <option value="mock">Mock Interview</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Level / Category
                    </label>
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                    >
                      {(selectedSection === "paragraph" ? paragraphLevels : mockLevels).map((lvl) => (
                        <option key={lvl.key} value={lvl.key}>
                          {lvl.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Question Text / Prompt
                  </label>
                  <textarea
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Type the question or interview scenario clearly..."
                    rows={3}
                    className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900 p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="rounded-lg bg-cyan-400 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition shadow-md shadow-cyan-950/40"
                  >
                    Submit for Approval
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setNewQuestion("");
                    }}
                    className="rounded-lg border border-slate-700 bg-slate-900 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Workflow Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
              <button
                type="button"
                onClick={() => setActiveTab("approved")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
                  activeTab === "approved"
                    ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-950/40"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <span>Active Live Questions</span>
                <span
                  className={`rounded-full px-2 py-0.2 text-xs font-extrabold ${
                    activeTab === "approved" ? "bg-slate-950 text-cyan-300" : "bg-slate-900 text-slate-300"
                  }`}
                >
                  {counts.approved}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("my_submissions")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
                  activeTab === "my_submissions"
                    ? "bg-indigo-500 text-white shadow-md shadow-indigo-950/40"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <span>My Submissions & Status</span>
              </button>
            </div>

            {/* Questions Listing */}
            {loading ? (
              <div className="py-12 text-center text-slate-400 text-sm">Loading questions...</div>
            ) : filteredQuestions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-800 py-12 text-center text-slate-400">
                <p className="text-sm font-bold text-slate-300">No questions found in this view.</p>
                <p className="text-xs text-slate-500 mt-1">
                  {activeTab === "my_submissions"
                    ? "You haven't submitted any questions yet."
                    : "Click '+ Submit Question' above to add one."}
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                {filteredQuestions.map((q) => {
                  const sectionLabel = q.section === "paragraph" ? "Paragraph Reading" : "Mock Interview";
                  const levelLabel =
                    q.section === "paragraph"
                      ? paragraphLevels.find((l) => l.key === q.level)?.label || q.level
                      : mockLevels.find((l) => l.key === q.level)?.label || q.level;

                  const isPending = q.status === "pending";
                  const isApproved = q.status === "approved";
                  const isRejected = q.status === "rejected";

                  return (
                    <div
                      key={q.id}
                      className={`rounded-xl border p-5 transition ${
                        isPending
                          ? "border-amber-500/50 bg-amber-950/20"
                          : isRejected
                          ? "border-rose-900/50 bg-rose-950/20"
                          : "border-slate-800 bg-slate-950/70"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          {/* Tags / Badges */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
                              {sectionLabel} • {levelLabel}
                            </span>

                            {isPending && (
                              <span className="rounded-full bg-amber-950 border border-amber-700/60 px-2.5 py-0.5 text-xs font-bold text-amber-300 flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                                Pending Super Admin Approval
                              </span>
                            )}

                            {isApproved && (
                              <span className="rounded-full bg-emerald-950 border border-emerald-700/60 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
                                ✓ Approved & Live
                              </span>
                            )}

                            {isRejected && (
                              <span className="rounded-full bg-rose-950 border border-rose-700/60 px-2.5 py-0.5 text-xs font-bold text-rose-300">
                                ✗ Rejected
                              </span>
                            )}
                          </div>

                          {/* Question text */}
                          <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                            "{q.question}"
                          </p>

                          {/* Submitter info */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 pt-1">
                            <span>
                              Submitted by: <strong className="text-slate-200">{q.submitted_by_name || "Admin"}</strong>
                            </span>
                            {q.reviewed_by_name && (
                              <span>
                                Reviewed by: <strong className="text-slate-200">{q.reviewed_by_name}</strong>
                              </span>
                            )}
                            {q.created_at && (
                              <span>
                                Date: {new Date(q.created_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          {/* Rejection Note */}
                          {isRejected && q.rejection_reason && (
                            <div className="mt-2 rounded-lg border border-rose-900/80 bg-rose-950/40 p-2.5 text-xs text-rose-200">
                              <strong>Rejection Feedback:</strong> {q.rejection_reason}
                            </div>
                          )}
                        </div>

                        {/* Admin Delete Action for their pending submissions */}
                        {isPending && q.submitted_by_email === currentUser?.email && (
                          <button
                            type="button"
                            onClick={() => handleDeleteQuestion(q.id, q.question)}
                            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:border-rose-500 hover:text-rose-300 transition shrink-0"
                          >
                            Withdraw Submission
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageInterviewQuestions;