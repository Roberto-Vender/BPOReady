import React, { useState } from "react";

const speakText = (text) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.85;
  window.speechSynthesis.speak(utterance);
};

const GrammarExerciseDrill = ({
  grammarScore = 100,
  grammarStatus = "Good",
  grammarIssues = [],
  grammarExercises = [],
}) => {
  const [userAnswers, setUserAnswers] = useState({});
  const [showExplanations, setShowExplanations] = useState({});

  const hasIssues = grammarIssues && grammarIssues.length > 0;
  const hasExercises = grammarExercises && grammarExercises.length > 0;

  const handleSelectOption = (exerciseIndex, selectedOption) => {
    setUserAnswers((prev) => ({
      ...prev,
      [exerciseIndex]: selectedOption,
    }));
    setShowExplanations((prev) => ({
      ...prev,
      [exerciseIndex]: true,
    }));
  };

  const handleResetExercises = () => {
    setUserAnswers({});
    setShowExplanations({});
  };

  const totalAnswered = Object.keys(userAnswers).length;
  const totalCorrect = hasExercises
    ? grammarExercises.filter(
        (ex, idx) =>
          userAnswers[idx] &&
          userAnswers[idx].trim().toLowerCase() === ex.correct_answer.trim().toLowerCase()
      ).length
    : 0;

  if (!hasIssues && !hasExercises) {
    return (
      <div className="rounded-xl border border-emerald-800/80 bg-emerald-950/40 p-4 text-emerald-200">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-slate-950 font-bold">
            ✓
          </div>
          <div>
            <h4 className="font-bold text-emerald-100 text-sm">Grammar & Structure: Strong</h4>
            <p className="text-xs text-emerald-300/80">
              No significant grammatical errors were detected in your response. Great job!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Grammar Analysis Breakdown Card */}
      {hasIssues && (
        <div className="rounded-xl border border-rose-900/80 bg-rose-950/30 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-rose-900/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
                !
              </span>
              <h4 className="font-bold text-rose-100 text-sm">Grammar & Phrasing Corrections</h4>
            </div>
            <span className="rounded-full bg-rose-950 border border-rose-800 px-2.5 py-0.5 text-xs font-bold text-rose-300">
              Score: {grammarScore}/100 ({grammarStatus})
            </span>
          </div>

          <p className="text-xs text-rose-300">
            We noticed phrasing or grammatical mistakes in your response. Review the corrections below:
          </p>

          <div className="space-y-3">
            {grammarIssues.map((issue, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-xs space-y-2"
              >
                {issue.original && (
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 font-bold text-rose-400 uppercase tracking-wide">
                      You said:
                    </span>
                    <span className="text-slate-300 line-through decoration-rose-500 font-mono">
                      "{issue.original}"
                    </span>
                  </div>
                )}

                {issue.correction && (
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <span className="shrink-0 font-bold text-emerald-400 uppercase tracking-wide">
                        Better:
                      </span>
                      <span className="font-semibold text-emerald-200">
                        "{issue.correction}"
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => speakText(issue.correction)}
                      className="inline-flex shrink-0 items-center gap-1 rounded bg-slate-800 border border-slate-700 px-2.5 py-1 text-[11px] font-semibold text-cyan-300 hover:bg-slate-700 transition"
                      title="Listen to pronunciation"
                    >
                      🔊 Listen
                    </button>
                  </div>
                )}

                {issue.explanation && (
                  <p className="mt-1 border-t border-slate-800/80 pt-2 text-[11px] text-slate-400">
                    <strong className="text-slate-300">Rule: </strong>
                    {issue.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Grammar Practice Drill */}
      {hasExercises && (
        <div className="rounded-xl border border-indigo-900/80 bg-indigo-950/30 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-indigo-900/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">
                ✎
              </span>
              <h4 className="font-bold text-indigo-100 text-sm">Grammar Practice Drill</h4>
            </div>
            {totalAnswered > 0 && (
              <span className="rounded-full bg-indigo-950 border border-indigo-700 px-2.5 py-0.5 text-xs font-bold text-indigo-300">
                Score: {totalCorrect}/{grammarExercises.length}
              </span>
            )}
          </div>

          <p className="text-xs text-indigo-200">
            Reinforce the correct rules with these quick practice questions:
          </p>

          <div className="space-y-4">
            {grammarExercises.map((exercise, idx) => {
              const selectedAnswer = userAnswers[idx];
              const isAnswered = Boolean(selectedAnswer);
              const isCorrect =
                isAnswered &&
                selectedAnswer.trim().toLowerCase() ===
                  exercise.correct_answer.trim().toLowerCase();

              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                      {exercise.title || `Exercise ${idx + 1}`}
                    </span>
                    {isAnswered && (
                      <span
                        className={`text-xs font-bold ${
                          isCorrect ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {isCorrect ? "✓ Correct" : "✗ Needs Review"}
                      </span>
                    )}
                  </div>

                  <p className="font-semibold text-white text-xs leading-relaxed">
                    {exercise.question}
                  </p>

                  {/* Options */}
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {exercise.options?.map((option, optIdx) => {
                      const isOptionSelected = selectedAnswer === option;
                      const isOptionCorrectAnswer =
                        option.trim().toLowerCase() ===
                        exercise.correct_answer.trim().toLowerCase();

                      let btnStyle =
                        "border-slate-800 bg-slate-900 text-slate-200 hover:border-cyan-500/50 hover:bg-slate-800";

                      if (isAnswered) {
                        if (isOptionCorrectAnswer) {
                          btnStyle =
                            "border-emerald-500 bg-emerald-950/60 text-emerald-200 font-bold ring-1 ring-emerald-500";
                        } else if (isOptionSelected && !isCorrect) {
                          btnStyle =
                            "border-rose-600 bg-rose-950/60 text-rose-300 line-through";
                        } else {
                          btnStyle =
                            "border-slate-900 bg-slate-950 text-slate-600 opacity-50";
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={isAnswered}
                          onClick={() => handleSelectOption(idx, option)}
                          className={`flex items-center justify-between rounded-lg border p-2.5 text-left text-xs transition ${btnStyle}`}
                        >
                          <span>{option}</span>
                          {isAnswered && isOptionCorrectAnswer && (
                            <span className="font-bold text-emerald-400 text-sm">✓</span>
                          )}
                          {isAnswered && isOptionSelected && !isCorrect && (
                            <span className="font-bold text-rose-400 text-sm">✗</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation when answered */}
                  {isAnswered && showExplanations[idx] && (
                    <div className="rounded-lg border border-indigo-900/60 bg-indigo-950/40 p-3 text-xs text-slate-200 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-indigo-300 text-xs">
                            {isCorrect ? "Well done!" : `Correct Answer: "${exercise.correct_answer}"`}
                          </p>
                          <p className="text-slate-300 text-[11px] leading-relaxed mt-0.5">
                            {exercise.explanation}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => speakText(exercise.correct_answer)}
                          className="shrink-0 rounded bg-slate-800 border border-slate-700 px-2 py-1 text-[11px] font-semibold text-cyan-300 hover:bg-slate-700"
                        >
                          🔊 Listen
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {totalAnswered === grammarExercises.length && (
            <div className="flex items-center justify-between border-t border-indigo-900/60 pt-3">
              <span className="text-xs font-semibold text-indigo-200">
                Drill Completed: {totalCorrect}/{grammarExercises.length} correct
              </span>
              <button
                type="button"
                onClick={handleResetExercises}
                className="rounded-lg bg-indigo-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-indigo-400 transition"
              >
                Reset Drill
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GrammarExerciseDrill;
