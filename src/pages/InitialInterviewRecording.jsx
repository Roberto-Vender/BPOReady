import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";
import { getInitialInterviewSession, getQuestions } from "../utils/questionData";

const InitialInterviewRecording = () => {
  const { mock } = useMemo(() => getQuestions(), []);
  const { questions, index } = useMemo(() => getInitialInterviewSession(), []);
  const question = questions[index] || questions[0] || mock.initial[0];
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const speechRecognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");
  const isRecordingRef = useRef(false);
  const audioUrlRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [speechLang, setSpeechLang] = useState("en-PH");
  const [audioUrl, setAudioUrl] = useState("");
  const [recordingError, setRecordingError] = useState("");
  const [transcription, setTranscription] = useState("");
  const [speechStatus, setSpeechStatus] = useState("idle");

  useEffect(() => {
    return () => {
      isRecordingRef.current = false;
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      speechRecognitionRef.current?.stop();
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    sessionStorage.setItem("initialInterviewTranscription", transcription);
  }, [transcription]);

  useEffect(() => {
    if (question?.question) {
      sessionStorage.setItem("initialInterviewQuestion", question.question);
    }
  }, [question]);

  const startRecording = async () => {
    setRecordingError("");

    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setRecordingError("Audio recording is not supported in this browser.");
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
      const audioChunks = [];
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      sessionStorage.removeItem("initialInterviewAudio");
      finalTranscriptRef.current = "";
      setTranscription("");
      setSpeechStatus("starting");
      isRecordingRef.current = true;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognition.lang = speechLang;
        recognition.onstart = () => setSpeechStatus("listening");

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

          const liveFull = (
            finalTranscriptRef.current + (interimSegment ? " " + interimSegment : "")
          ).replace(/\s+/g, " ").trim();

          setTranscription(liveFull);
        };

        recognition.onerror = (event) => {
          if (event.error !== "aborted" && event.error !== "no-speech") {
            setRecordingError(`Speech recognition note: ${event.error}`);
          }
        };

        recognition.onend = () => {
          if (isRecordingRef.current) {
            try {
              recognition.start();
            } catch {
              setSpeechStatus("waiting");
            }
          }
        };

        speechRecognitionRef.current = recognition;
        recognition.start();
      } else {
        setSpeechStatus("unsupported");
      }

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
        }
        const url = URL.createObjectURL(audioBlob);
        audioUrlRef.current = url;
        setAudioUrl(url);

        const reader = new FileReader();
        reader.onloadend = () => {
          try {
            sessionStorage.setItem("initialInterviewAudio", reader.result);
          } catch {
            // Storage quota exceeded fallback
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      setRecordingError(
        err.name === "NotAllowedError"
          ? "Microphone access was denied. Please allow microphone permissions."
          : "Unable to start audio recording."
      );
    }
  };

  const stopRecording = () => {
    isRecordingRef.current = false;
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      speechRecognitionRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }

    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    mediaRecorderRef.current = null;

    setIsRecording(false);
    setSpeechStatus("stopped");
  };

  return (
    <div className="flex min-h-screen bg-slate-950 font-poppins text-slate-100">
      <StudentSidebar />

      <main className="flex-1 ml-20 flex flex-col justify-center items-center p-6 min-h-screen">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl w-full max-w-xl space-y-6">
          {/* Header */}
          <div className="text-center border-b border-slate-800 pb-4">
            <span className="rounded-full bg-cyan-950 border border-cyan-800 px-3 py-0.5 text-xs font-semibold text-cyan-300">
              Mock Interview • Question 1 of {questions.length}
            </span>
            <h2 className="text-xl font-bold text-white mt-3">Voice Response Recording</h2>
          </div>

          {/* Question Display */}
          <div className="rounded-xl border border-cyan-900/50 bg-slate-950 p-5 text-center shadow-inner space-y-1">
            <p className="text-sm font-bold text-slate-100 leading-relaxed">
              "{question?.question || "No question available."}"
            </p>
            <p className="text-xs text-slate-400">Speak clearly and structure your thoughts naturally.</p>
          </div>

          {/* Live Recording Status Indicator */}
          <div className="text-center">
            {isRecording ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-800 bg-rose-950/70 px-4 py-1.5 text-xs font-bold text-rose-300">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
                <span>Recording in progress...</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-4 py-1.5 text-xs text-slate-400">
                <span>{audioUrl ? "Recording captured • Ready to submit" : "Microphone idle"}</span>
              </div>
            )}
          </div>

          {recordingError && (
            <div className="rounded-xl border border-rose-800/70 bg-rose-950/40 p-3 text-xs text-rose-200 text-center">
              {recordingError}
            </div>
          )}

          {/* Audio Playback */}
          {audioUrl && (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Review Your Recording:
              </p>
              <audio className="w-full" controls src={audioUrl} />
            </div>
          )}

          {/* Transcription Preview */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Live Speech Transcription
              </span>
              {!isRecording && (
                <div className="inline-flex items-center rounded-lg border border-slate-800 bg-slate-900 p-0.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setSpeechLang("en-PH")}
                    className={`rounded px-2 py-0.5 font-medium transition ${speechLang === "en-PH" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"}`}
                  >
                    PH Accent
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpeechLang("en-US")}
                    className={`rounded px-2 py-0.5 font-medium transition ${speechLang === "en-US" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"}`}
                  >
                    US Accent
                  </button>
                </div>
              )}
              <span className="text-[10px] text-slate-500">
                {speechStatus === "listening" ? "Listening..." : "Automatic Voice-to-Text"}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed min-h-12 bg-slate-900/60 p-3 rounded-lg border border-slate-800/60">
              {transcription || "Press 'Start Recording' and begin speaking. Your words will transcribe here in real time."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`flex-1 rounded-xl py-3 text-xs font-bold transition shadow-md ${
                isRecording
                  ? "bg-rose-500 hover:bg-rose-400 text-white shadow-rose-950/40"
                  : "bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-cyan-950/40"
              }`}
            >
              {isRecording ? "⏹ Stop Recording" : "🎙 Start Recording"}
            </button>

            <Link to="/MockInterviewFeedback" className="flex-1">
              <button
                type="button"
                disabled={isRecording || (!transcription && !audioUrl)}
                className="w-full rounded-xl bg-emerald-500 py-3 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition shadow-md shadow-emerald-950/40 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Submit Answer →
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InitialInterviewRecording;