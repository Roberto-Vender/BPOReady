import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";
import {
  getParagraphChunks,
  paragraphContent,
  targetWordsPerMinute,
  readAssessmentResult,
  readLevelResults,
} from "../utils/paragraphAssessment";

const PacingExercise = ({
  level: levelProp,
  text: textProp,
  initialTargetWpm: targetWpmProp,
  userPreviousWpm: prevWpmProp,
  onClose = null,
  isStandalone = false,
}) => {
  const { level: routeLevel } = useParams();
  const level = levelProp || routeLevel || "easy";

  const savedResult = level === "assessment" ? readAssessmentResult() : readLevelResults()[level];
  const text = textProp || paragraphContent[level]?.text || paragraphContent.easy.text;
  const defaultWpm = targetWpmProp || savedResult?.targetWordsPerMinute || targetWordsPerMinute[level] || 140;
  const userPreviousWpm = prevWpmProp !== undefined ? prevWpmProp : savedResult?.wordsPerMinute;

  const [targetWpm, setTargetWpm] = useState(defaultWpm);
  const [activeTab, setActiveTab] = useState("teleprompter"); // 'teleprompter' | 'chunking' | 'live'

  const words = useMemo(() => {
    return text ? text.split(/\s+/).filter(Boolean) : [];
  }, [text]);

  const chunks = useMemo(() => {
    return getParagraphChunks(text);
  }, [text]);

  const expectedDurationSeconds = useMemo(() => {
    if (!words.length || targetWpm <= 0) return 0;
    return Number(((words.length / targetWpm) * 60).toFixed(1));
  }, [words.length, targetWpm]);

  // Pacer state
  const [isPlayingPacer, setIsPlayingPacer] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(-1);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [metronomeEnabled, setMetronomeEnabled] = useState(false);
  const [isSpeakingModel, setIsSpeakingModel] = useState(false);

  // Live Speech Recognition state
  const [isLiveRecording, setIsLiveRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [liveSpokenCount, setLiveSpokenCount] = useState(0);
  const [liveError, setLiveError] = useState("");
  const [drillResult, setDrillResult] = useState(null);
  const [speechLang, setSpeechLang] = useState("en-PH");

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");
  const isLiveRecordingRef = useRef(false);
  const mediaStreamRef = useRef(null);
  const audioCtxRef = useRef(null);

  const msPerWord = useMemo(() => {
    return Math.max(100, Math.round((60 / targetWpm) * 1000));
  }, [targetWpm]);

  const playClickSound = () => {
    if (!metronomeEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current?.state === "suspended") {
        audioCtxRef.current.resume();
      }
      if (audioCtxRef.current) {
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, audioCtxRef.current.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.03);
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 0.03);
      }
    } catch {
      // Audio context restricted or unavailable
    }
  };

  useEffect(() => {
    if (isPlayingPacer) {
      startTimeRef.current = Date.now() - elapsedSeconds * 1000;
      const interval = setInterval(() => {
        const now = Date.now();
        const elapsed = (now - startTimeRef.current) / 1000;
        setElapsedSeconds(elapsed);

        const wordIdx = Math.floor((elapsed * 1000) / msPerWord);
        if (wordIdx !== currentWordIndex) {
          if (wordIdx < words.length) {
            setCurrentWordIndex(wordIdx);
            playClickSound();
          } else {
            setCurrentWordIndex(words.length - 1);
            setIsPlayingPacer(false);
            clearInterval(interval);
          }
        }

        if (chunks.length > 0) {
          const chunkDuration = expectedDurationSeconds / chunks.length;
          const chunkIdx = Math.min(chunks.length - 1, Math.floor(elapsed / chunkDuration));
          setCurrentChunkIndex(chunkIdx);
        }
      }, 50);

      timerRef.current = interval;
      return () => clearInterval(interval);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isPlayingPacer, msPerWord, words.length, chunks.length, expectedDurationSeconds, metronomeEnabled]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      isLiveRecordingRef.current = false;
      if (recognitionRef.current) recognitionRef.current.stop();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  const handleStartPacer = () => {
    if (currentWordIndex >= words.length - 1) {
      setCurrentWordIndex(-1);
      setCurrentChunkIndex(-1);
      setElapsedSeconds(0);
    }
    setIsPlayingPacer(true);
  };

  const handlePausePacer = () => {
    setIsPlayingPacer(false);
  };

  const handleResetPacer = () => {
    setIsPlayingPacer(false);
    setCurrentWordIndex(-1);
    setCurrentChunkIndex(-1);
    setElapsedSeconds(0);
  };

  const handlePlayModelVoice = () => {
    if (!window.speechSynthesis) return;
    if (isSpeakingModel) {
      window.speechSynthesis.cancel();
      setIsSpeakingModel(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = Math.max(0.6, Math.min(1.8, targetWpm / 140));

    utterance.onstart = () => {
      setIsSpeakingModel(true);
      handleResetPacer();
      setIsPlayingPacer(true);
    };

    utterance.onend = () => {
      setIsSpeakingModel(false);
      setIsPlayingPacer(false);
    };

    utterance.onerror = () => {
      setIsSpeakingModel(false);
      setIsPlayingPacer(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStartLiveDrill = async () => {
    setLiveError("");
    setDrillResult(null);
    setLiveTranscript("");
    finalTranscriptRef.current = "";
    setLiveSpokenCount(0);
    handleResetPacer();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setLiveError("Live speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 48000,
        },
      });
      mediaStreamRef.current = stream;

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = speechLang;

      recognition.onresult = (event) => {
        let interimSegment = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          const textSegment = res[0]?.transcript || "";
          if (res.isFinal) {
            finalTranscriptRef.current = (
              finalTranscriptRef.current + " " + textSegment.trim()
            ).replace(/\s+/g, " ").trim();
          } else {
            interimSegment += (interimSegment ? " " : "") + textSegment.trim();
          }
        }

        const fullTranscript = (
          finalTranscriptRef.current + (interimSegment ? " " + interimSegment : "")
        ).replace(/\s+/g, " ").trim();

        setLiveTranscript(fullTranscript);
        const count = fullTranscript.split(/\s+/).filter(Boolean).length;
        setLiveSpokenCount(count);
      };

      recognition.onerror = (e) => {
        if (e.error !== "no-speech" && e.error !== "aborted") {
          setLiveError(`Recognition notice: ${e.error}`);
        }
      };

      recognition.onend = () => {
        if (isLiveRecordingRef.current) {
          try {
            recognition.start();
          } catch {
            // Already active or restarting
          }
        }
      };

      recognitionRef.current = recognition;
      isLiveRecordingRef.current = true;
      recognition.start();
      setIsLiveRecording(true);
      handleStartPacer();
    } catch (err) {
      setLiveError(
        err.name === "NotAllowedError"
          ? "Microphone permission was denied. Please allow microphone permissions."
          : "Could not initialize microphone."
      );
    }
  };

  const handleStopLiveDrill = () => {
    isLiveRecordingRef.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }

    setIsLiveRecording(false);
    handlePausePacer();

    const duration = Math.max(1, elapsedSeconds);
    const spokenWordsCount = liveTranscript.split(/\s+/).filter(Boolean).length;
    const actualWpm = Math.round((spokenWordsCount / duration) * 60);
    const ratio = targetWpm > 0 ? actualWpm / targetWpm : 1;
    const paceDiff = Math.abs(actualWpm - targetWpm);
    const accuracyScore = Math.max(0, Math.min(100, Math.round(100 - Math.abs(ratio - 1) * 80)));

    let status = "Steady Cadence";
    let message = "";
    let isPositive = true;

    if (paceDiff <= 12) {
      status = "Great Pacing!";
      message = `You spoke at ${actualWpm} WPM (target: ${targetWpm} WPM) with ${accuracyScore}% accuracy. Your rhythm is clear and natural.`;
      isPositive = true;
    } else if (actualWpm > targetWpm) {
      status = "Too Fast";
      message = `You spoke at ${actualWpm} WPM (${paceDiff} WPM faster than target). Pause briefly at periods and commas to keep your words clear.`;
      isPositive = false;
    } else {
      status = "Too Slow";
      message = `You spoke at ${actualWpm} WPM (${paceDiff} WPM slower than target). Read in groups of 4 to 6 words to maintain steady momentum.`;
      isPositive = false;
    }

    setDrillResult({
      actualWpm,
      targetWpm,
      spokenWordsCount,
      durationSeconds: Math.round(duration),
      accuracyScore,
      status,
      message,
      isPositive,
    });
  };

  const currentLiveWpm = elapsedSeconds > 2 && liveSpokenCount > 0
    ? Math.round((liveSpokenCount / elapsedSeconds) * 60)
    : null;

  const contentUI = (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl text-slate-100">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-cyan-300">Pacing Exercise & Drill</h3>
          <p className="text-xs text-slate-400">
            Target Pace: <span className="font-semibold text-white">{targetWpm} WPM</span> • Target Time: <span className="font-semibold text-white">{expectedDurationSeconds}s</span> ({words.length} words)
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            Close
          </button>
        )}
      </div>

      {/* Target Pace Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Target Pace:</span>
          <button
            type="button"
            onClick={() => setTargetWpm((w) => Math.max(80, w - 5))}
            className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 font-bold text-slate-200 hover:bg-slate-800"
          >
            -5
          </button>
          <span className="font-bold text-cyan-400 min-w-[50px] text-center">{targetWpm} WPM</span>
          <button
            type="button"
            onClick={() => setTargetWpm((w) => Math.min(220, w + 5))}
            className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 font-bold text-slate-200 hover:bg-slate-800"
          >
            +5
          </button>

          <div className="hidden sm:flex items-center gap-1.5 ml-2">
            {[
              { label: "Slow (115)", value: 115 },
              { label: `Target (${defaultWpm})`, value: defaultWpm },
              { label: "Fast (160)", value: 160 },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setTargetWpm(preset.value)}
                className={`rounded-md px-2 py-1 text-[11px] font-semibold transition ${targetWpm === preset.value
                  ? "bg-cyan-400 text-slate-950 font-bold"
                  : "border border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800"
                  }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={metronomeEnabled}
              onChange={(e) => setMetronomeEnabled(e.target.checked)}
              className="rounded accent-cyan-400"
            />
            <span>Metronome Click</span>
          </label>

          <button
            type="button"
            onClick={handlePlayModelVoice}
            className={`rounded-md px-3 py-1 text-xs font-semibold shadow-sm border transition ${isSpeakingModel
              ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold"
              : "border border-slate-700 bg-slate-900 text-cyan-300 hover:bg-slate-800"
              }`}
          >
            {isSpeakingModel ? "Stop Audio" : "Listen to Target Pace"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-4 flex gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("teleprompter")}
          className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${activeTab === "teleprompter"
              ? "bg-cyan-400 text-slate-950 font-bold"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
        >
          Visual Pacer
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("chunking")}
          className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${activeTab === "chunking"
              ? "bg-cyan-400 text-slate-950 font-bold"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
        >
          Phrase Chunking
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("live")}
          className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${activeTab === "live"
              ? "bg-cyan-400 text-slate-950 font-bold"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
        >
          Live Voice Practice
        </button>
      </div>

      {/* Main Tab Views */}
      <div className="mt-4">
        {/* TAB 1: VISUAL PACER */}
        {activeTab === "teleprompter" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Read along with the highlighted word:</span>
              <span className="font-semibold text-slate-200">
                Time: {elapsedSeconds.toFixed(1)}s / {expectedDurationSeconds}s
              </span>
            </div>

            {/* Reading Box */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
              <p className="text-center leading-relaxed text-slate-200 text-base">
                {words.map((word, idx) => {
                  const isCurrent = idx === currentWordIndex;
                  const isPast = idx < currentWordIndex;
                  return (
                    <span
                      key={`${word}-${idx}`}
                      className={`inline-block px-1 py-0.5 rounded transition-colors ${isCurrent
                        ? "bg-cyan-400 text-slate-950 font-bold"
                        : isPast
                          ? "text-slate-100 font-medium"
                          : "text-slate-500"
                        }`}
                    >
                      {word}{" "}
                    </span>
                  );
                })}
              </p>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-3 pt-2">
              {!isPlayingPacer ? (
                <button
                  type="button"
                  onClick={handleStartPacer}
                  className="rounded-xl bg-cyan-400 px-8 py-2.5 font-bold text-slate-950 shadow-md hover:bg-cyan-300 transition"
                >
                  Start Pacer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePausePacer}
                  className="rounded-xl bg-slate-800 px-8 py-2.5 font-semibold text-white shadow-md hover:bg-slate-700 transition"
                >
                  Pause
                </button>
              )}
              <button
                type="button"
                onClick={handleResetPacer}
                className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-2.5 font-semibold text-slate-300 shadow-sm hover:bg-slate-800 transition"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: PHRASE CHUNKING */}
        {activeTab === "chunking" && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Read in groups of 4 to 6 words. Take a short, natural breath pause after each group.
            </p>

            <div className="space-y-2.5">
              {chunks.map((chunk, idx) => {
                const isCurrentChunk = isPlayingPacer && idx === currentChunkIndex;
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between rounded-xl border p-3.5 text-sm transition-colors ${isCurrentChunk
                      ? "border-cyan-400 bg-cyan-950/40 text-cyan-200 font-semibold"
                      : "border-slate-800 bg-slate-900/60 text-slate-300"
                      }`}
                  >
                    <span>{chunk}</span>
                    <span className="text-xs text-slate-500 font-normal">Pause (0.5s)</span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center gap-3 pt-2">
              {!isPlayingPacer ? (
                <button
                  type="button"
                  onClick={handleStartPacer}
                  className="rounded-xl bg-cyan-400 px-8 py-2.5 font-bold text-slate-950 shadow-md hover:bg-cyan-300 transition"
                >
                  Guide Chunks
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePausePacer}
                  className="rounded-xl bg-slate-800 px-8 py-2.5 font-semibold text-white shadow-md hover:bg-slate-700 transition"
                >
                  Pause
                </button>
              )}
              <button
                type="button"
                onClick={handleResetPacer}
                className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-2.5 font-semibold text-slate-300 shadow-sm hover:bg-slate-800 transition"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: LIVE VOICE DRILL */}
        {activeTab === "live" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
              <p className="text-center leading-relaxed text-slate-200 text-base">
                {text}
              </p>
            </div>

            {/* Status & Live metrics */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span>Status: <strong className={isLiveRecording ? "text-rose-400" : "text-slate-100"}>{isLiveRecording ? "Recording in progress..." : "Ready"}</strong></span>
                {!isLiveRecording && (
                  <div className="inline-flex items-center rounded-lg border border-slate-800 bg-slate-950 p-0.5 ml-2">
                    <button
                      type="button"
                      onClick={() => setSpeechLang("en-PH")}
                      className={`rounded px-2 py-0.5 font-semibold transition ${speechLang === "en-PH" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-slate-200"}`}
                    >
                      PH Accent
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpeechLang("en-US")}
                      className={`rounded px-2 py-0.5 font-semibold transition ${speechLang === "en-US" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-slate-200"}`}
                    >
                      US Accent
                    </button>
                  </div>
                )}
              </div>
              <span>Spoken: <strong>{liveSpokenCount}</strong> / {words.length} words</span>
              <span>Live Speed: <strong>{currentLiveWpm !== null ? `${currentLiveWpm} WPM` : "--"}</strong></span>
              <span>Duration: <strong>{elapsedSeconds.toFixed(1)}s</strong></span>
            </div>

            {liveTranscript && (
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs text-slate-300">
                <span className="font-semibold text-cyan-300">Transcript:</span> {liveTranscript}
              </div>
            )}

            {liveError && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/40 p-3 text-xs text-amber-300">
                {liveError}
              </div>
            )}

            {drillResult && (
              <div className={`rounded-xl border p-4 text-sm ${drillResult.isPositive ? "border-emerald-500/30 bg-emerald-950/30 text-emerald-300" : "border-amber-500/30 bg-amber-950/30 text-amber-300"
                }`}>
                <div className="flex justify-between items-center font-bold mb-1">
                  <span>{drillResult.status}</span>
                  <span>{drillResult.actualWpm} WPM (target: {drillResult.targetWpm} WPM)</span>
                </div>
                <p className="text-xs opacity-90">{drillResult.message}</p>
              </div>
            )}

            {/* Controls */}
            <div className="flex justify-center gap-3 pt-2">
              {!isLiveRecording ? (
                <button
                  type="button"
                  onClick={handleStartLiveDrill}
                  className="rounded-xl bg-cyan-400 px-8 py-2.5 font-bold text-slate-950 shadow-md hover:bg-cyan-300 transition"
                >
                  Start Practice
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopLiveDrill}
                  className="rounded-xl bg-rose-600 px-8 py-2.5 font-semibold text-white shadow-md hover:bg-rose-500 transition"
                >
                  Stop Recording
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // If accessed directly as a standalone route, render with page shell
  if (isStandalone || (!levelProp && routeLevel)) {
    return (
      <div className="flex min-h-screen bg-slate-950 font-poppins text-slate-100">
        <StudentSidebar />
        <main className="ml-20 flex-1">
          <header className="bg-slate-900/90 border-b border-slate-800 px-8 py-4 sticky top-0 z-30 backdrop-blur-md flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">
              {paragraphContent[level]?.title || "Practice"} - Pacing Exercise
            </h1>
            <Link to={`/paragraph-result/${level}`}>
              <button className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:border-cyan-400 hover:text-cyan-300 transition">
                ← Back to Result
              </button>
            </Link>
          </header>
          <section className="mx-auto max-w-3xl px-6 py-10">
            {contentUI}
          </section>
        </main>
      </div>
    );
  }

  // Otherwise render embedded component
  return contentUI;
};

export default PacingExercise;