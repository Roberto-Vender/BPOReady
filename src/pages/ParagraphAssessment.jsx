import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  analyzeParagraph,
  paragraphContent,
  readAssessmentResult,
  readLevelResults,
  saveAssessmentResult,
  getCurrentUser,
  PASSING_SCORE,
} from "../utils/paragraphAssessment";
import StudentSidebar from "../components/StudentSidebar";

const ParagraphAssessment = ({ level: levelProp }) => {
  const { level: routeLevel } = useParams();
  const level = routeLevel || levelProp || "assessment";
  const navigate = useNavigate();
  const content = paragraphContent[level] || paragraphContent.assessment;
  const currentUser = getCurrentUser();

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");
  const isRecordingRef = useRef(false);
  const recordingStartedAtRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [speechLang, setSpeechLang] = useState("en-PH");
  const [transcription, setTranscription] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Ready to record");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const assessmentResult = readAssessmentResult(currentUser);
    const assessmentScore = assessmentResult?.score || 0;
    const levelResults = readLevelResults(currentUser);
    const easyScore = levelResults.easy?.score || 0;
    const mediumScore = levelResults.medium?.score || 0;

    // Pre-assessment can only be taken once per user
    if (level === "assessment" && assessmentResult) {
      navigate("/paragraph-result/assessment", { replace: true });
      return;
    }

    if (level === "easy" && !assessmentResult) navigate("/ParagraphReading", { replace: true });
    if (level === "medium" && (assessmentScore < PASSING_SCORE || easyScore < PASSING_SCORE)) navigate("/ParagraphReading", { replace: true });
    if (level === "hard" && (assessmentScore < PASSING_SCORE || easyScore < PASSING_SCORE || mediumScore < PASSING_SCORE)) navigate("/ParagraphReading", { replace: true });
  }, [level, navigate, currentUser]);

  useEffect(() => () => {
    isRecordingRef.current = false;
    recognitionRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const startRecording = async () => {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError("Audio recording is not supported in this browser.");
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

      const recorder = new MediaRecorder(stream);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      streamRef.current = stream;
      recorderRef.current = recorder;
      finalTranscriptRef.current = "";
      setTranscription("");
      isRecordingRef.current = true;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognition.lang = speechLang;
        recognition.onstart = () => setStatus("Listening...");

        recognition.onresult = (event) => {
          let interimSegment = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const res = event.results[i];
            const text = res[0]?.transcript || "";
            if (res.isFinal) {
              finalTranscriptRef.current = (
                finalTranscriptRef.current + " " + text.trim()
              ).replace(/\s+/g, " ").trim();
            } else {
              interimSegment += (interimSegment ? " " : "") + text.trim();
            }
          }

          const liveFull = (
            finalTranscriptRef.current + (interimSegment ? " " + interimSegment : "")
          ).replace(/\s+/g, " ").trim();

          setTranscription(liveFull);
        };

        recognition.onerror = (e) => {
          if (e.error !== "no-speech" && e.error !== "aborted") {
            setError(`Speech recognition note: ${e.error}`);
          }
        };

        recognition.onend = () => {
          if (isRecordingRef.current) {
            try {
              recognition.start();
            } catch {
              // Ignore if already active
            }
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
      } else {
        setStatus("Recording audio...");
        setError("Live transcription is not supported in this browser. Use Chrome for the most accurate experience.");
      }

      recorder.start();
      recordingStartedAtRef.current = Date.now();
      setIsRecording(true);
    } catch (recordingError) {
      setError(recordingError.name === "NotAllowedError" ? "Microphone access was denied. Please allow microphone permissions." : "The microphone could not be started.");
    }
  };

  const stopRecording = () => {
    isRecordingRef.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    recorderRef.current = null;
    setIsRecording(false);
    setStatus("Recording complete");
  };

  const submitAssessment = async () => {
    if (!transcription.trim()) {
      setError("Read the paragraph and record your voice before submitting.");
      return;
    }
    setIsSubmitting(true);

    try {
      const durationSeconds = recordingStartedAtRef.current ? (Date.now() - recordingStartedAtRef.current) / 1000 : 0;
      const result = {
        ...analyzeParagraph(transcription, content.text, durationSeconds, level),
        level,
        transcription,
        completedAt: new Date().toISOString(),
      };

      await saveAssessmentResult(result, level, currentUser);
      navigate(`/paragraph-result/${level}`);
    } catch (submitErr) {
      setError("Unable to save assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 font-poppins text-slate-100">
      <StudentSidebar />

      <main className="ml-20 flex-1">
        {/* Header */}
        <header className="bg-slate-900/90 border-b border-slate-800 px-8 py-4 sticky top-0 z-30 backdrop-blur-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">
              {content.title} - Paragraph Reading
            </h1>
            <Link to="/ParagraphReading" className="text-xs text-cyan-400 hover:underline font-semibold">
              ← Back to Levels
            </Link>
          </div>
        </header>

        {/* Content Section */}
        <section className="mx-auto max-w-3xl px-6 py-10 space-y-8">
          {error && (
            <div className="rounded-xl border border-rose-800/70 bg-rose-950/50 p-4 text-xs font-semibold text-rose-200">
              {error}
            </div>
          )}

          {/* Reading Material Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Target Reading Paragraph
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Accent:</span>
                <select
                  value={speechLang}
                  onChange={(e) => setSpeechLang(e.target.value)}
                  disabled={isRecording}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
                >
                  <option value="en-PH">English (Philippines)</option>
                  <option value="en-US">English (US)</option>
                </select>
              </div>
            </div>

            <p className="text-lg leading-relaxed text-slate-200 font-medium">
              "{content.text}"
            </p>
          </div>

          {/* Live Transcription Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Live Speech Transcription
              </span>
              <span className={`text-xs font-semibold ${isRecording ? "text-red-400 animate-pulse" : "text-slate-400"}`}>
                ● {status}
              </span>
            </div>

            <div className="min-h-24 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
              {transcription || (
                <span className="italic text-slate-600">
                  Your spoken words will appear here in real time as you read the paragraph above...
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="flex items-center gap-2 rounded-xl bg-cyan-400 px-8 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300 transition shadow-lg shadow-cyan-950/40"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-slate-950 animate-ping"></span>
                Start Recording Voice
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="flex items-center gap-2 rounded-xl bg-rose-500 px-8 py-3 text-sm font-bold text-white hover:bg-rose-600 transition shadow-lg shadow-rose-950/40 animate-pulse"
              >
                <span className="h-3 w-3 rounded-sm bg-white"></span>
                Stop Recording
              </button>
            )}

            <button
              type="button"
              onClick={submitAssessment}
              disabled={isRecording || !transcription.trim() || isSubmitting}
              className="rounded-xl bg-emerald-500 px-8 py-3 text-sm font-bold text-white hover:bg-emerald-400 transition shadow-lg shadow-emerald-950/40 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit for Evaluation →"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ParagraphAssessment;