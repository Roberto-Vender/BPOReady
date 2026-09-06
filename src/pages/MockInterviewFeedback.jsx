import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";
import { getInitialInterviewSession, getQuestions, getShuffledInitialQuestions } from "../utils/questionData";
import GrammarExerciseDrill from "../components/GrammarExerciseDrill";

const MockInterviewFeedback = () => {
  const navigate = useNavigate();
  const transcription = sessionStorage.getItem("initialInterviewTranscription") || "";
  const audio = sessionStorage.getItem("initialInterviewAudio") || "";
  const savedQuestion = sessionStorage.getItem("initialInterviewQuestion") || "";
  const { questions, index } = useMemo(() => getInitialInterviewSession(), []);
  const question = savedQuestion || questions[index]?.question || questions[0]?.question || "Interview question";
  const [aiFeedback, setAiFeedback] = useState(null);
  const [aiLoading, setAiLoading] = useState(Boolean(transcription));
  const [aiError, setAiError] = useState("");

  const fillerMatches = useMemo(
    () =>
      transcription
        .toLowerCase()
        .match(/\b(?:um+|uh+|er+|like|actually|basically|kuan|kanang|ka\s+nang|kana\s+bitaw|bitaw|lagi|gud|ba|man|noh|no|aw|ambot|unsa|unsaon|murag|you\s+know)\b/gi) || [],
    [transcription]
  );
  const fillerCounts = useMemo(
    () =>
      fillerMatches.reduce(
        (counts, word) => ({
          ...counts,
          [word]: (counts[word] || 0) + 1,
        }),
        {}
      ),
    [fillerMatches]
  );
  const fillerSummary = Object.entries(fillerCounts)
    .map(([word, count]) => `"${word}" (${count})`)
    .join(", ");
  const detectedFillerWords = aiFeedback?.filler_words || fillerMatches;
  const fillerWordCounts = detectedFillerWords.reduce(
    (counts, word) => {
      const normalizedWord = word.toLowerCase().trim();

      if (/^um+$/.test(normalizedWord) || /^uh+$/.test(normalizedWord)) {
        counts.ummUhh += 1;
      }
      counts.words[normalizedWord] = (counts.words[normalizedWord] || 0) + 1;

      return counts;
    },
    { ummUhh: 0, words: {} }
  );
  const detectedFillerSummary =
    Object.entries(fillerWordCounts.words)
      .map(([word, count]) => `${word} (${count}x)`)
      .join(", ") || "None detected";

  useEffect(() => {
    if (!transcription) {
      setAiLoading(false);
      setAiError("No transcription was found. Record an answer before submitting it for AI feedback.");
      return;
    }

    const analyzeAnswer = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
        const response = await fetch(`${apiUrl}/api/interview/feedback`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ question, transcription, audio }),
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to generate AI feedback.");
        }

        setAiFeedback(data.feedback);
      } catch (error) {
        setAiError(error.message || "Unable to generate AI feedback.");
      } finally {
        setAiLoading(false);
      }
    };

    analyzeAnswer();
  }, [audio, question, transcription]);

  const hasNextQuestion = index + 1 < questions.length;

  const handleNextQuestion = () => {
    const nextIndex = index + 1;

    if (nextIndex < questions.length) {
      sessionStorage.setItem("initialInterviewIndex", String(nextIndex));
      navigate("/InitialInterviewRecording");
      return;
    }

    const resetQuestions = getShuffledInitialQuestions(getQuestions().mock.initial);
    sessionStorage.setItem("initialInterviewQueue", JSON.stringify(resetQuestions));
    sessionStorage.setItem("initialInterviewIndex", "0");
    navigate("/InitialInterview");
  };

  return (
    <div className="flex min-h-screen bg-slate-950 font-poppins text-slate-100">
      <StudentSidebar />

      <main className="flex-1 ml-20 py-10 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Main Feedback Container */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl space-y-6">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-5 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Mock Interview AI Feedback</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Question: <span className="text-cyan-300 font-semibold">"{question}"</span>
                </p>
              </div>
              <Link to="/MockInterview">
                <button className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:border-cyan-400 hover:text-cyan-300 transition">
                  ← Back to Menu
                </button>
              </Link>
            </div>

            {/* Metrics Overview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Overall Score
                </p>
                <p className="text-2xl font-bold text-cyan-400">
                  {aiFeedback ? `${aiFeedback.overall_score}/100` : aiLoading ? "..." : "--"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Grammar Score
                </p>
                <p className="text-2xl font-bold text-indigo-400">
                  {aiFeedback ? `${aiFeedback.grammar_score ?? 100}/100` : aiLoading ? "..." : "--"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Clarity
                </p>
                <p className="text-2xl font-bold text-emerald-400">
                  {aiFeedback?.clarity || (aiLoading ? "..." : "Good")}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Filler Words
                </p>
                <p className="text-2xl font-bold text-amber-400">
                  {aiLoading ? fillerMatches.length : detectedFillerWords.length}
                </p>
              </div>
            </div>

            {/* Detailed Speech Breakdown */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2 text-xs text-slate-300">
              <p><strong className="text-slate-200">Umms / Uhhs Total:</strong> {aiLoading ? fillerMatches.filter((word) => /^(um+|uh+)$/i.test(word)).length : fillerWordCounts.ummUhh}</p>
              <p><strong className="text-slate-200">Filler Words Detected:</strong> {aiLoading ? (fillerSummary || "None detected") : detectedFillerSummary}</p>
              <p><strong className="text-slate-200">Speaking Confidence:</strong> {aiFeedback?.confidence || (aiLoading ? "Analyzing..." : "Moderate")}</p>
              <p><strong className="text-slate-200">Pacing Evaluation:</strong> {aiFeedback?.pacing || (aiLoading ? "Analyzing..." : "Steady")}</p>
            </div>

            {/* Overall AI Feedback Note */}
            <div className="rounded-xl border border-cyan-900/60 bg-linear-to-br from-cyan-950/30 via-slate-900 to-slate-900 p-5 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">AI Coach Evaluation:</p>
              {aiLoading && <p className="text-sm text-slate-400 animate-pulse">AI is analyzing your voice recording and grammar accuracy...</p>}
              {!aiLoading && aiError && <p className="text-sm text-rose-300">{aiError}</p>}
              {!aiLoading && !aiError && <p className="text-sm text-slate-200 leading-relaxed">{aiFeedback?.feedback}</p>}
            </div>

            {/* Grammar Review & Interactive Practice Drill */}
            {!aiLoading && !aiError && aiFeedback && (
              <GrammarExerciseDrill
                grammarScore={aiFeedback.grammar_score}
                grammarStatus={aiFeedback.grammar_status}
                grammarIssues={aiFeedback.grammar_issues}
                grammarExercises={aiFeedback.grammar_exercises}
              />
            )}

            {/* Suggestions for Improvement */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Key Actionable Suggestions:
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                {(aiFeedback?.suggestions?.length ? aiFeedback.suggestions : [
                  "Structure your answers with the STAR method (Situation, Task, Action, Result).",
                  "Use short pauses instead of filler words when organizing your next sentence.",
                ]).map((suggestion, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Navigation Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/InitialInterview" className="flex-1">
                <button className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 text-xs font-bold text-slate-300 hover:border-cyan-400 hover:text-cyan-300 transition">
                  Retry Interview
                </button>
              </Link>
              <button
                onClick={handleNextQuestion}
                className="flex-1 rounded-xl bg-cyan-400 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition shadow-lg shadow-cyan-950/40"
              >
                {hasNextQuestion ? "Next Question →" : "Start New Interview Session →"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MockInterviewFeedback;