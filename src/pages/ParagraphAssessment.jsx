import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { analyzeParagraph, paragraphContent, PARAGRAPH_ASSESSMENT_KEY, PARAGRAPH_LEVEL_RESULTS_KEY } from "../utils/paragraphAssessment";
import StudentSidebar from "../components/StudentSidebar";

const ParagraphAssessment = ({ level: levelProp }) => {
  const { level: routeLevel } = useParams();
  const level = routeLevel || levelProp || "assessment";
  const navigate = useNavigate();
  const content = paragraphContent[level] || paragraphContent.assessment;
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

  useEffect(() => {
    const assessmentResult = JSON.parse(localStorage.getItem("paragraphAssessmentResult") || "null");
    const assessmentScore = assessmentResult?.score || 0;
    const mediumScore = JSON.parse(localStorage.getItem("paragraphLevelResults") || "{}").medium?.score || 0;
    const easyScore = JSON.parse(localStorage.getItem("paragraphLevelResults") || "{}").easy?.score || 0;

    // Pre-assessment can only be taken once
    if (level === "assessment" && assessmentResult) {
      navigate("/paragraph-result/assessment", { replace: true });
      return;
    }

    if (level === "easy" && assessmentScore < 1) navigate("/ParagraphReading", { replace: true });
    if (level === "medium" && (assessmentScore < 75 || easyScore < 75)) navigate("/ParagraphReading", { replace: true });
    if (level === "hard" && (assessmentScore < 75 || easyScore < 75 || mediumScore < 75)) navigate("/ParagraphReading", { replace: true });
  }, [level, navigate]);

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

  const submitAssessment = () => {
    if (!transcription.trim()) {
      setError("Read the paragraph and record your voice before submitting.");
      return;
    }
    const durationSeconds = recordingStartedAtRef.current ? (Date.now() - recordingStartedAtRef.current) / 1000 : 0;
    const result = { ...analyzeParagraph(transcription, content.text, durationSeconds, level), level, transcription, completedAt: new Date().toISOString() };
    if (level === "assessment") localStorage.setItem(PARAGRAPH_ASSESSMENT_KEY, JSON.stringify(result));
    else {
      const results = JSON.parse(localStorage.getItem(PARAGRAPH_LEVEL_RESULTS_KEY) || "{}");
      localStorage.setItem(PARAGRAPH_LEVEL_RESULTS_KEY, JSON.stringify({ ...results, [level]: result }));
    }
    navigate(`/paragraph-result/${level}`);
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
          <div className="text-center">
            <p className="text-sm text-slate-400">
              Read the paragraph aloud clearly and at a natural conversational pace. Scoring evaluates word accuracy, pace, and filler words.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl space-y-6">
            {/* Passage Text Container */}
            <div className="rounded-xl border border-cyan-900/50 bg-slate-950 p-6 shadow-inner">
              <p className="text-center text-lg leading-relaxed text-slate-200 font-medium select-none">
                {content.text}
              </p>
            </div>

            {/* Status & Live Transcription */}
            <div className="text-center space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-bold border border-slate-800 bg-slate-950">
                  <span className={`h-2.5 w-2.5 rounded-full ${isRecording ? "bg-rose-500 animate-ping" : "bg-cyan-400"}`}></span>
                  <span className={isRecording ? "text-rose-400" : "text-slate-300"}>
                    {isRecording ? "Recording in progress..." : status}
                  </span>
                </div>

                {!isRecording && (
                  <div className="inline-flex items-center rounded-lg border border-slate-800 bg-slate-950 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setSpeechLang("en-PH")}
                      className={`rounded px-2.5 py-1 font-semibold transition ${speechLang === "en-PH" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-slate-200"}`}
                    >
                      PH Accent (en-PH)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpeechLang("en-US")}
                      className={`rounded px-2.5 py-1 font-semibold transition ${speechLang === "en-US" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-slate-200"}`}
                    >
                      US Accent (en-US)
                    </button>
                  </div>
                )}
              </div>

              {transcription && (
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-left">
                  <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
                    Live Transcription:
                  </p>
                  <p className="text-sm text-slate-300 leading-relaxed">{transcription}</p>
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-xl border border-amber-800/70 bg-amber-950/40 p-4 text-xs text-amber-200">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`rounded-xl px-8 py-3 text-sm font-bold text-slate-950 transition shadow-lg ${
                  isRecording
                    ? "bg-rose-500 hover:bg-rose-400 text-white shadow-rose-950/40"
                    : "bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-cyan-950/40"
                }`}
              >
                {isRecording ? "⏹ Stop Recording" : "🎙 Start Recording"}
              </button>

              <button
                onClick={submitAssessment}
                disabled={isRecording}
                className="rounded-xl bg-emerald-500 px-8 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition shadow-lg shadow-emerald-950/40 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Submit Reading →
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ParagraphAssessment;