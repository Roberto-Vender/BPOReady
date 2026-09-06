import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const SuperAdminQuestionApprovals = () => {
  const navigate = useNavigate();
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const [questions, setQuestions] = useState([]);
  const [counts, setCounts] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending"); // 'pending' | 'approved' | 'rejected' | 'all'
  const [filterSection, setFilterSection] = useState("all"); // 'all' | 'paragraph' | 'mock'
  const [selectedSection, setSelectedSection] = useState("paragraph");
  const [selectedLevel, setSelectedLevel] = useState("easy");
  const [newQuestion, setNewQuestion] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Rejection modal
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminQuestions();
      setQuestions(data.questions || []);
      setCounts(data.counts || { total: 0, pending: 0, approved: 0, rejected: 0 });
      fetchLiveQuestions().catch(() => {});
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to load questions from backend." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await updateQuestionStatusApi(id, {
        status: "approved",
        reviewer_name: user?.name || "Super Admin",
      });
      setMessage({ type: "success", text: res.message || "Question approved and published live!" });
      await loadData();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to approve question." });
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectingId) return;
    try {
      const res = await updateQuestionStatusApi(rejectingId, {
        status: "rejected",
        reviewer_name: user?.name || "Super Admin",
        rejection_reason: rejectionReason.trim() || "Does not meet standard BPO criteria.",
      });
      setMessage({ type: "success", text: res.message || "Question rejected." });
      setRejectingId(null);
      setRejectionReason("");
      await loadData();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to reject question." });
    }
  };

  const handleDelete = async (id, text) => {
    if (!window.confirm(`Permanently delete this question?\n\n"${text}"`)) return;
    try {
      const res = await deleteQuestionApi(id);
      setMessage({ type: "success", text: res.message || "Question deleted." });
      await loadData();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to delete question." });
    }
  };

  const handleCreateDirectQuestion = async (e) => {
    e.preventDefault();
    const trimmed = newQuestion.trim();
    if (!trimmed) {
      setMessage({ type: "error", text: "Please enter a question prompt." });
      return;
    }

    try {
      const res = await submitQuestionApi({
        section: selectedSection,
        level: selectedLevel,
        question: trimmed,
        role: "super_admin",
        submitter_name: user?.name || "Super Admin",
        submitter_email: user?.email || "",
      });

      setMessage({ type: "success", text: res.message || "Direct question published live!" });
      setNewQuestion("");
      setShowAddForm(false);
      await loadData();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to add question." });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/AdminLogin");
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (activeTab !== "all" && q.status !== activeTab) return false;
      if (filterSection !== "all" && q.section !== filterSection) return false;
      return true;
    });
  }, [questions, activeTab, filterSection]);

  return (
    <div className="min-h-screen bg-slate-950 font-poppins text-slate-100">
      {/* Super Admin Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 px-6 py-4 sticky top-0 z-30 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/SuperAdminDashboard" className="flex items-center gap-2">
              <span className="text-xl font-bold text-cyan-400">BPOReady</span>
              <span className="rounded bg-cyan-950 border border-cyan-700/60 px-2 py-0.5 text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                Super Admin
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-2 text-sm">
              <Link
                to="/SuperAdminDashboard"
                className="rounded-lg px-3 py-2 text-slate-400 hover:text-slate-200 transition"
              >
                Dashboard
              </Link>
              <Link
                to="/SuperAdminQuestionApprovals"
                className="rounded-lg bg-slate-800 px-3 py-2 font-semibold text-cyan-400 border border-slate-700 flex items-center gap-2"
              >
                <span>Question Approvals</span>
                {counts.pending > 0 && (
                  <span className="rounded-full bg-amber-500 px-2 py-0.2 text-xs font-bold text-slate-950">
                    {counts.pending}
                  </span>
                )}
              </Link>
              <Link
                to="/SuperAdminUsers"
                className="rounded-lg px-3 py-2 text-slate-400 hover:text-slate-200 transition"
              >
                User List
              </Link>
              <Link
                to="/CreateAdminAccount"
                className="rounded-lg px-3 py-2 text-slate-400 hover:text-slate-200 transition"
              >
                Create Admin
              </Link>
            </nav>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-rose-400 hover:text-rose-300"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
        {/* Title Header Card */}
        <section className="rounded-2xl border border-cyan-900/60 bg-linear-to-br from-cyan-950 to-slate-900 p-8 shadow-2xl shadow-cyan-950/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Content Governance & Review
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
                Question Approval Center
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                Review question submissions from regular Admins. Approved questions immediately become available in applicant practice and mock interview sessions.
              </p>
            </div>

            <button
              onClick={() => setShowAddForm((prev) => !prev)}
              className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300 transition shadow-lg shadow-cyan-950/40 flex items-center gap-2 self-start sm:self-auto"
            >
              <span>{showAddForm ? "✕ Close Form" : "+ Add Live Question"}</span>
            </button>
          </div>
        </section>

        {/* Quick Stats Grid */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Pending Approvals
            </p>
            <p className="mt-2 text-3xl font-bold text-amber-400">{counts.pending}</p>
            <p className="mt-1 text-xs text-slate-400">Submitted by Admins</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Live / Approved
            </p>
            <p className="mt-2 text-3xl font-bold text-emerald-400">{counts.approved}</p>
            <p className="mt-1 text-xs text-slate-400">Active in applicant practice</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-400">
              Rejected
            </p>
            <p className="mt-2 text-3xl font-bold text-rose-400">{counts.rejected}</p>
            <p className="mt-1 text-xs text-slate-400">Declined submissions</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Total Questions
            </p>
            <p className="mt-2 text-3xl font-bold text-white">{counts.total}</p>
            <p className="mt-1 text-xs text-slate-400">All database entries</p>
          </div>
        </section>

        {/* Status Alerts */}
        {message.text && (
          <div
            className={`rounded-xl border p-4 text-sm flex items-center justify-between ${
              message.type === "error"
                ? "border-rose-800/70 bg-rose-950/50 text-rose-200"
                : "border-emerald-800/70 bg-emerald-950/50 text-emerald-200"
            }`}
          >
            <span>{message.text}</span>
            <button
              type="button"
              onClick={() => setMessage({ type: "", text: "" })}
              className="text-xs font-bold uppercase hover:underline ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Add Direct Live Question Form */}
        {showAddForm && (
          <form
            onSubmit={handleCreateDirectQuestion}
            className="rounded-2xl border border-cyan-800/70 bg-slate-900 p-6 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-cyan-300">
                  Publish New Live Question (Super Admin Direct)
                </h3>
                <p className="text-xs text-slate-400">
                  As Super Admin, questions added here are instantly approved and live for all applicants.
                </p>
              </div>
              <span className="rounded-full bg-emerald-950 border border-emerald-700 px-3 py-0.5 text-xs font-bold text-emerald-300">
                Directly Approved
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Section
                </label>
                <select
                  value={selectedSection}
                  onChange={(e) => {
                    setSelectedSection(e.target.value);
                    setSelectedLevel(e.target.value === "paragraph" ? "easy" : "initial");
                  }}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 focus:border-cyan-400 focus:outline-none"
                >
                  <option value="paragraph">Paragraph Reading</option>
                  <option value="mock">Mock Interview</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Level / Category
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 focus:border-cyan-400 focus:outline-none"
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Question Text / Prompt
              </label>
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Type the interview question or reading passage..."
                rows={3}
                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="rounded-lg bg-cyan-400 px-6 py-2.5 text-sm font-bold text-slate-950 hover:bg-cyan-300 transition"
              >
                Publish Question Live
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewQuestion("");
                }}
                className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Tab Filters */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            {/* Status Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("pending")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${
                  activeTab === "pending"
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <span>Pending Approvals</span>
                <span
                  className={`rounded-full px-2 py-0.2 text-xs font-extrabold ${
                    activeTab === "pending"
                      ? "bg-slate-950 text-amber-300"
                      : "bg-amber-950 text-amber-300 border border-amber-800/60"
                  }`}
                >
                  {counts.pending}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("approved")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${
                  activeTab === "approved"
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <span>Live / Approved</span>
                <span
                  className={`rounded-full px-2 py-0.2 text-xs font-extrabold ${
                    activeTab === "approved"
                      ? "bg-slate-950 text-emerald-300"
                      : "bg-emerald-950 text-emerald-300 border border-emerald-800/60"
                  }`}
                >
                  {counts.approved}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("rejected")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${
                  activeTab === "rejected"
                    ? "bg-rose-500 text-slate-950 shadow-md shadow-rose-950/40"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <span>Rejected</span>
                <span
                  className={`rounded-full px-2 py-0.2 text-xs font-extrabold ${
                    activeTab === "rejected"
                      ? "bg-slate-950 text-rose-300"
                      : "bg-rose-950 text-rose-300 border border-rose-800/60"
                  }`}
                >
                  {counts.rejected}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${
                  activeTab === "all"
                    ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-950/40"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <span>All ({counts.total})</span>
              </button>
            </div>

            {/* Section filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Section:</span>
              <select
                value={filterSection}
                onChange={(e) => setFilterSection(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
              >
                <option value="all">All Sections</option>
                <option value="paragraph">Paragraph Reading</option>
                <option value="mock">Mock Interview</option>
              </select>
            </div>
          </div>

          {/* Question List */}
          {loading ? (
            <div className="py-16 text-center text-slate-400">Loading questions from backend...</div>
          ) : filteredQuestions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-800 py-16 text-center text-slate-400">
              <p className="text-base font-bold text-slate-300">
                {activeTab === "pending"
                  ? "🎉 Zero Pending Approvals!"
                  : "No questions found matching your filter."}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {activeTab === "pending"
                  ? "All Admin submissions have been reviewed and processed."
                  : "Try choosing another category or click '+ Add Live Question' above."}
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              {filteredQuestions.map((q) => {
                const sectionName = q.section === "paragraph" ? "Paragraph Reading" : "Mock Interview";
                const levelName =
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
                        ? "border-amber-500/60 bg-amber-950/25 shadow-lg shadow-amber-950/20"
                        : isRejected
                        ? "border-rose-900/60 bg-rose-950/20"
                        : "border-slate-800 bg-slate-950/60"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-2.5 flex-1">
                        {/* Status Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
                            {sectionName} • {levelName}
                          </span>

                          {isPending && (
                            <span className="rounded-full bg-amber-500/20 border border-amber-500/50 px-3 py-0.5 text-xs font-bold text-amber-300 flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
                              Awaiting Your Approval
                            </span>
                          )}

                          {isApproved && (
                            <span className="rounded-full bg-emerald-950/80 border border-emerald-700/60 px-3 py-0.5 text-xs font-bold text-emerald-300">
                              ✓ Live & Active
                            </span>
                          )}

                          {isRejected && (
                            <span className="rounded-full bg-rose-950/80 border border-rose-700/60 px-3 py-0.5 text-xs font-bold text-rose-300">
                              ✗ Rejected
                            </span>
                          )}
                        </div>

                        {/* Question Text */}
                        <p className="text-base font-semibold text-slate-100 leading-relaxed">
                          "{q.question}"
                        </p>

                        {/* Submitter & Reviewer Meta */}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-400 pt-1">
                          <span>
                            Submitted by: <strong className="text-slate-200">{q.submitted_by_name || "Admin"}</strong>
                            {q.submitted_by_email && ` (${q.submitted_by_email})`}
                          </span>
                          {q.reviewed_by_name && (
                            <span>
                              Reviewed by: <strong className="text-slate-200">{q.reviewed_by_name}</strong>
                            </span>
                          )}
                          {q.created_at && (
                            <span>
                              Submitted: {new Date(q.created_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {/* Rejection Note */}
                        {isRejected && q.rejection_reason && (
                          <div className="mt-2 rounded-lg border border-rose-900/80 bg-rose-950/40 p-3 text-xs text-rose-200">
                            <strong>Rejection Feedback:</strong> {q.rejection_reason}
                          </div>
                        )}
                      </div>

                      {/* Approval Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {isPending && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApprove(q.id)}
                              className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition shadow-md shadow-emerald-950/40"
                            >
                              ✓ Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setRejectingId(q.id);
                                setRejectionReason("");
                              }}
                              className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500 transition shadow-md shadow-rose-950/40"
                            >
                              ✗ Reject
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDelete(q.id, q.question)}
                          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-400 hover:border-rose-500 hover:text-rose-300 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Rejection Feedback Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs font-poppins">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Reject Question Submission</h3>
            <p className="text-xs text-slate-400 mb-4">
              Provide feedback for the Admin explaining why this question cannot be approved:
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Duplicate question, phrasing needs more clarity, tone is not appropriate for BPO interviews..."
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200 focus:border-rose-500 focus:outline-none mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setRejectingId(null);
                  setRejectionReason("");
                }}
                className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectConfirm}
                className="rounded-lg bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-500 shadow-md shadow-rose-950/50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminQuestionApprovals;
