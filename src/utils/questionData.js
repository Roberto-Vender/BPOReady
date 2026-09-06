const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const defaultParagraphQuestions = {
  easy: [
    { id: 1, question: "Tell me about yourself.", status: "approved" },
    { id: 2, question: "Why do you want to work in the BPO industry?", status: "approved" },
  ],
  medium: [
    { id: 3, question: "How do you handle difficult customers?", status: "approved" },
    { id: 4, question: "How do you manage stress in a fast-paced environment?", status: "approved" },
  ],
  hard: [
    { id: 5, question: "Describe a situation where you had to resolve a conflict at work.", status: "approved" },
  ],
};

const defaultMockInterviewQuestions = {
  initial: [
    { id: 101, question: "Tell me about yourself.", status: "approved" },
    { id: 102, question: "Why should we hire you?", status: "approved" },
  ],
  final: [
    { id: 201, question: "Describe a time you handled a difficult customer.", status: "approved" },
  ],
};

const normalizeQuestions = (value, fallback) => {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback;
  }

  return value
    .filter((item) => item && typeof item.question === "string" && item.question.trim())
    .map((item) => ({
      id: item.id || Date.now() + Math.random(),
      question: item.question.trim(),
      status: item.status || "approved",
    }));
};

export const getShuffledInitialQuestions = (questions = []) => {
  if (!Array.isArray(questions) || questions.length === 0) {
    return questions;
  }

  const firstQuestionIndex = questions.findIndex((item) =>
    item?.question?.toLowerCase().includes("tell me about yourself")
  );

  const fixedQuestion = firstQuestionIndex >= 0 ? questions[firstQuestionIndex] : null;
  const remainingQuestions = questions.filter((_, index) => index !== firstQuestionIndex);
  const shuffledRemaining = [...remainingQuestions];

  for (let i = shuffledRemaining.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledRemaining[i], shuffledRemaining[j]] = [shuffledRemaining[j], shuffledRemaining[i]];
  }

  return fixedQuestion ? [fixedQuestion, ...shuffledRemaining] : shuffledRemaining;
};

export const getInitialInterviewSession = () => {
  if (typeof window === "undefined") {
    return { questions: [], index: 0 };
  }

  try {
    const storedQueue = window.sessionStorage.getItem("initialInterviewQueue");
    const storedIndex = window.sessionStorage.getItem("initialInterviewIndex");

    if (storedQueue) {
      const questions = JSON.parse(storedQueue);
      return {
        questions: Array.isArray(questions) ? questions : [],
        index: Number(storedIndex) || 0,
      };
    }
  } catch (error) {
    console.error("Unable to read initial interview session", error);
  }

  const questions = getShuffledInitialQuestions(getQuestions().mock.initial);
  window.sessionStorage.setItem("initialInterviewQueue", JSON.stringify(questions));
  window.sessionStorage.setItem("initialInterviewIndex", "0");
  return { questions, index: 0 };
};

export const resetInitialInterviewSession = () => {
  if (typeof window === "undefined") {
    return [];
  }

  const questions = getShuffledInitialQuestions(getQuestions().mock.initial);
  window.sessionStorage.setItem("initialInterviewQueue", JSON.stringify(questions));
  window.sessionStorage.setItem("initialInterviewIndex", "0");
  return questions;
};

export const getQuestions = () => {
  if (typeof window === "undefined") {
    return {
      paragraph: defaultParagraphQuestions,
      mock: defaultMockInterviewQuestions,
    };
  }

  try {
    const saved = window.localStorage.getItem("bpoReadyQuestions");
    if (!saved) {
      return {
        paragraph: defaultParagraphQuestions,
        mock: defaultMockInterviewQuestions,
      };
    }

    const parsed = JSON.parse(saved);

    return {
      paragraph: {
        easy: normalizeQuestions(parsed?.paragraph?.easy, defaultParagraphQuestions.easy),
        medium: normalizeQuestions(parsed?.paragraph?.medium, defaultParagraphQuestions.medium),
        hard: normalizeQuestions(parsed?.paragraph?.hard, defaultParagraphQuestions.hard),
      },
      mock: {
        initial: normalizeQuestions(parsed?.mock?.initial, defaultMockInterviewQuestions.initial),
        final: normalizeQuestions(parsed?.mock?.final, defaultMockInterviewQuestions.final),
      },
    };
  } catch (error) {
    console.error("Unable to load stored questions", error);
    return {
      paragraph: defaultParagraphQuestions,
      mock: defaultMockInterviewQuestions,
    };
  }
};

export const saveQuestions = ({ paragraph, mock }) => {
  if (typeof window === "undefined") {
    return;
  }

  const payload = {
    paragraph,
    mock,
  };

  window.localStorage.setItem("bpoReadyQuestions", JSON.stringify(payload));
};

export const fetchLiveQuestions = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/questions`);
    if (!res.ok) throw new Error("Failed to fetch live questions");
    const data = await res.json();
    saveQuestions(data);
    return data;
  } catch (err) {
    console.warn("Using cached/local questions due to network error:", err);
    return getQuestions();
  }
};

export const fetchAdminQuestions = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/api/admin/questions${query ? `?${query}` : ""}`);
  if (!res.ok) throw new Error("Failed to fetch admin questions");
  return await res.json();
};

export const submitQuestionApi = async (payload) => {
  const res = await fetch(`${API_BASE}/api/admin/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to submit question");
  return data;
};

export const updateQuestionStatusApi = async (id, payload) => {
  const res = await fetch(`${API_BASE}/api/admin/questions/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update question status");
  return data;
};

export const deleteQuestionApi = async (id) => {
  const res = await fetch(`${API_BASE}/api/admin/questions/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete question");
  return data;
};
