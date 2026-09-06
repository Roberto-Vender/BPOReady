export const PARAGRAPH_ASSESSMENT_KEY = "paragraphAssessmentResult";
export const PARAGRAPH_LEVEL_RESULTS_KEY = "paragraphLevelResults";
export const PASSING_SCORE = 75;

export const targetWordsPerMinute = {
  assessment: 135,
  easy: 140,
  medium: 155,
  hard: 170,
};

export const paragraphContent = {
  assessment: {
    title: "Pre-Assessment",
    text: "Clear communication helps people understand ideas, solve problems, and build trust. In this assessment, read the paragraph at a natural pace and focus on pronunciation, fluency, and confidence.",
  },
  easy: {
    title: "Easy Level",
    text: "Good customer service begins with careful listening. When we understand a customer's concern, we can respond politely and offer the right solution. A calm voice and clear words help every conversation end positively.",
  },
  medium: {
    title: "Medium Level",
    text: "Effective communication in a busy workplace requires more than speaking clearly. Professionals must organize their thoughts, adjust their tone, and explain useful information while responding to unexpected questions and changing priorities.",
  },
  hard: {
    title: "Hard Level",
    text: "Successful professionals synthesize complex information, acknowledge competing perspectives, and articulate practical recommendations without losing precision. They remain composed during ambiguity, invite constructive dialogue, and translate strategic objectives into measurable collaborative action.",
  },
};

export const fillerPattern = /\b(?:um+|uh+|er+|like|actually|basically|kuan|kanang|ka\s+nang|kana\s+bitaw|bitaw|lagi|gud|ba|man|noh|no|aw|ambot|unsa|unsaon|murag|you\s+know)\b/gi;

const CONTRACTIONS = {
  "can't": "can not",
  "won't": "will not",
  "let's": "let us",
  "n't": " not",
  "'re": " are",
  "'s": " is",
  "'d": " would",
  "'ll": " will",
  "'ve": " have",
  "'m": " am",
};

const expandContractions = (text) => {
  let expanded = text.toLowerCase();
  for (const [contraction, replacement] of Object.entries(CONTRACTIONS)) {
    expanded = expanded.replaceAll(contraction, replacement);
  }
  return expanded;
};

const levenshteinDistance = (a, b) => {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      const val = a[i - 1] === b[j - 1] ? row[j - 1] : Math.min(row[j - 1], row[j], prev) + 1;
      row[j - 1] = prev;
      prev = val;
    }
    row[b.length] = prev;
  }
  return row[b.length];
};

const isFuzzyMatch = (w1, w2) => {
  if (!w1 || !w2) return false;
  if (w1 === w2) return true;
  if (w1.replace(/s$/, "") === w2.replace(/s$/, "")) return true;
  if (Math.abs(w1.length - w2.length) <= 1 && Math.min(w1.length, w2.length) >= 4) {
    return levenshteinDistance(w1, w2) <= 1;
  }
  return false;
};

const normalizeWords = (text) => {
  const expanded = expandContractions(text || "");
  return (expanded.match(/[a-z0-9]+(?:'[a-z0-9]+)?/g) || [])
    .map((word) => word.replace(/'s$/i, "").replace(/[^a-z0-9]/gi, ""))
    .filter(Boolean);
};

const isFiller = (word) => /^(?:um+|uh+|er+|like|actually|basically|kuan|kanang|bitaw|lagi|gud|ba|man|noh|no|aw|ambot|unsa|unsaon|murag)$/.test(word);

export function analyzeParagraph(text, targetText, durationSeconds = 0, level = "assessment") {
  const spokenWords = normalizeWords(text);
  const targetWords = normalizeWords(targetText);
  const fillers = (text || "").match(fillerPattern) || [];
  let matchedWords = 0;
  let spokenIndex = 0;
  const wrongWords = [];

  targetWords.forEach((targetWord) => {
    let matchIndex = -1;
    const searchLimit = Math.min(spokenIndex + 4, spokenWords.length);
    for (let i = spokenIndex; i < searchLimit; i++) {
      if (isFuzzyMatch(spokenWords[i], targetWord)) {
        matchIndex = i;
        break;
      }
    }

    if (matchIndex >= 0) {
      matchedWords += 1;
      spokenIndex = matchIndex + 1;
    } else if (spokenWords[spokenIndex] && !isFiller(spokenWords[spokenIndex])) {
      wrongWords.push({ said: spokenWords[spokenIndex], expected: targetWord });
      spokenIndex += 1;
    }
  });

  const accuracy = targetWords.length ? matchedWords / targetWords.length : 0;
  const pronunciationPenalty = Math.min(30, wrongWords.length * 5);
  const fillerPenalty = Math.min(30, fillers.length * 4);
  const targetWpm = targetWordsPerMinute[level] || targetWordsPerMinute.assessment;
  const actualWpm = durationSeconds > 0 ? (spokenWords.length / durationSeconds) * 60 : 0;
  const paceRatio = actualWpm > 0 ? actualWpm / targetWpm : 0;
  const pacePenalty = actualWpm > 0 ? Math.min(50, Math.round(Math.abs(paceRatio - 1) * 100)) : 50;
  const score = Math.max(0, Math.min(100, Math.round(accuracy * 60 + (35 - pacePenalty) + (fillers.length ? 5 : 10) - fillerPenalty - pronunciationPenalty)));
  const fillerCounts = fillers.reduce((counts, filler) => {
    const normalizedFiller = filler.toLowerCase();
    counts[normalizedFiller] = (counts[normalizedFiller] || 0) + 1;
    return counts;
  }, {});

  return {
    score,
    fillers,
    fillerCounts,
    wrongWords: wrongWords.slice(0, 8),
    pronunciationPenalty,
    fillerPenalty,
    pacePenalty,
    totalWords: spokenWords.length,
    durationSeconds: Math.round(durationSeconds),
    wordsPerMinute: Math.round(actualWpm),
    targetWordsPerMinute: targetWpm,
    ummUhhTotal: fillers.filter((word) => /^(um+|uh+)$/i.test(word)).length,
    clarity: score >= 85 ? "Excellent" : score >= 70 ? "Good" : score >= 50 ? "Fair" : "Poor",
    confidence: score >= 85 ? "High" : score >= 65 ? "Moderate" : "Low",
    pacing: actualWpm === 0 ? "Unable to assess" : Math.abs(paceRatio - 1) <= 0.12
      ? "Steady"
      : actualWpm < targetWpm ? "Too slow" : "Too fast",
  };
}

export function readLevelResults() {
  try {
    return JSON.parse(localStorage.getItem(PARAGRAPH_LEVEL_RESULTS_KEY) || "{}");
  } catch {
    return {};
  }
}

export function readAssessmentResult() {
  try {
    return JSON.parse(localStorage.getItem(PARAGRAPH_ASSESSMENT_KEY) || "null");
  } catch {
    return null;
  }
}

export function getParagraphChunks(text) {
  if (!text) return [];
  // Split into sentences and natural phrase boundaries
  const clauses = text.split(/(?<=[.,;:!?])\s+/);
  const chunks = [];

  clauses.forEach((clause) => {
    const words = clause.trim().split(/\s+/);
    if (words.length <= 6) {
      if (clause.trim()) chunks.push(clause.trim());
    } else {
      // Break longer clauses into 3-5 word chunks
      let current = [];
      words.forEach((w) => {
        current.push(w);
        if (current.length >= 4 && (w.endsWith(",") || w.endsWith(";") || current.length >= 6)) {
          chunks.push(current.join(" "));
          current = [];
        }
      });
      if (current.length > 0) {
        chunks.push(current.join(" "));
      }
    }
  });

  return chunks;
}

export function getPracticeExercises(result, level = "assessment") {
  const exercises = [];
  const targetWpm = result?.targetWordsPerMinute || targetWordsPerMinute[level] || 140;
  const isPacingIssue = result?.pacing === "Too slow" || result?.pacing === "Too fast" || (result?.pacePenalty && result.pacePenalty > 0);

  // Always supply a pacing exercise, marked as primary if pacing penalty occurred
  exercises.push({
    type: "pacing",
    title: "Interactive Pacing Drill",
    status: isPacingIssue ? result?.pacing : "Pace refinement",
    targetWordsPerMinute: targetWpm,
    actualWordsPerMinute: result?.wordsPerMinute || 0,
    isPriority: Boolean(isPacingIssue),
    instruction: result?.pacing === "Too fast"
      ? `You spoke faster than the ${targetWpm} WPM target. Practice pausing at punctuation and matching the interactive pacer below.`
      : result?.pacing === "Too slow"
      ? `You spoke slower than the ${targetWpm} WPM target. Practice linking words smoothly in 4-6 word chunks to build cadence.`
      : `Refine your rhythm and cadence to consistently hit the ideal ${targetWpm} WPM customer service standard.`,
  });

  if (result?.fillers?.length) {
    exercises.push({
      type: "filler",
      title: "Filler-word drill",
      instruction: "Pause silently for one second instead of saying a filler. Replace each filler with a calm breath and try the paragraph again.",
    });
  }

  return exercises;
}