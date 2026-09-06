"""Small Python AI gateway for interview feedback.

Run from backend with:
    python python_ai/ai_service.py
"""

from __future__ import annotations

import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

HOST = os.getenv("PYTHON_AI_HOST", "127.0.0.1")
PORT = int(os.getenv("PYTHON_AI_PORT", "8010"))
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"


def load_backend_env() -> None:
    env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
    if not os.path.exists(env_path):
        return
    with open(env_path, encoding="utf-8") as env_file:
        for line in env_file:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            os.environ[key.strip()] = value.strip().strip('"')


def build_prompt(question: str, transcription: str) -> str:
    return f"""You are an expert interview and English communication coach for BPO applicants in the Philippines.
Analyze the applicant's spoken response against the interview question.

Carefully evaluate grammar, sentence structure, and word choices. Detect errors like:
- Subject-verb agreement (e.g. "he do", "they is", "she have")
- Verb tense errors (e.g. "I graduate last year", "I did went")
- Missing or wrong prepositions / articles (e.g. "listen customer", "in morning")
- Literal local translation or broken sentence structure (e.g. "I am have experience", "I am graduate of")
- Pronoun errors, pluralization errors, and awkward phrasing

Return ONLY a valid JSON object with this exact shape:
{{
  "overall_score": 0,
  "clarity": "Good|Needs improvement|Poor",
  "confidence": "High|Moderate|Low",
  "pacing": "Steady|Slightly fast|Slightly slow|Unable to assess",
  "filler_words": ["um", "uh"],
  "feedback": "short, specific coaching paragraph evaluating content and communication",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "grammar_score": 100,
  "grammar_status": "Good|Needs Improvement|Poor",
  "grammar_issues": [
    {{
      "original": "problematic phrase or sentence from transcript",
      "correction": "corrected professional sentence",
      "explanation": "concise explanation of why it is incorrect and how to fix it"
    }}
  ],
  "grammar_exercises": [
    {{
      "title": "Subject-Verb Agreement Drill",
      "question": "Fill in the blank: 'Our team _____ (handle) customer inquiries promptly.'",
      "options": ["handle", "handles", "handled", "handling"],
      "correct_answer": "handles",
      "explanation": "Use singular verb 'handles' with collective noun 'team'."
    }}
  ]
}}

Rules:
- "overall_score" from 0 to 100.
- "grammar_score" from 0 to 100.
- If there are grammar errors or poor sentence structure in the candidate's answer, provide 1 to 3 items in "grammar_issues" with the exact original phrase, corrected phrasing, and rule explanation.
- If there are grammar errors, generate 2 targeted multiple-choice practice exercises in "grammar_exercises" designed to help the candidate practice the exact grammar rules they struggled with.
- If grammar is completely correct, return grammar_score=100, grammar_status="Good", grammar_issues=[], grammar_exercises=[].
- Preserve every filler occurrence, including um, umm, uh, uhhh, er, like, actually, basically, you know, kuan, kanang, kana bitaw, bitaw, lagi, gud, ba, man, noh, no, aw, ambot, unsa, unsaon, and murag.

Question:
{question}

Transcript:
{transcription}"""


def analyze(payload: dict) -> dict:
    load_backend_env()
    api_key = os.getenv("GROQ_API_KEY", "")
    if not api_key:
        raise RuntimeError("AI feedback is not configured. Add GROQ_API_KEY to backend/.env.")

    body = json.dumps({
        "model": os.getenv("GROQ_MODEL", "openai/gpt-oss-20b"),
        "temperature": 0.2,
        "messages": [
            {"role": "system", "content": "Return ONLY valid JSON. No markdown code blocks, no backticks, no commentary."},
            {"role": "user", "content": build_prompt(payload["question"], payload["transcription"])},
        ],
    }).encode("utf-8")
    request = Request(GROQ_URL, data=body, headers={
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "BPOReady-AI/1.0",
    }, method="POST")

    with urlopen(request, timeout=60) as response:
        result = json.loads(response.read().decode("utf-8"))

    content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
    content = content.strip()
    if content.startswith("```"):
        content = content.split("\n", 1)[-1]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()

    if not content.startswith("{"):
        start = content.find("{")
        end = content.rfind("}")
        if start != -1 and end != -1:
            content = content[start:end+1]

    feedback = json.loads(content)
    return {"feedback": {
        "overall_score": max(0, min(100, int(feedback.get("overall_score", 0)))),
        "clarity": feedback.get("clarity", "Unable to assess"),
        "confidence": feedback.get("confidence", "Unable to assess"),
        "pacing": feedback.get("pacing", "Unable to assess"),
        "filler_words": [word for word in feedback.get("filler_words", []) if isinstance(word, str)],
        "feedback": feedback.get("feedback", "No written feedback was returned."),
        "suggestions": [item for item in feedback.get("suggestions", []) if isinstance(item, str)],
        "grammar_score": max(0, min(100, int(feedback.get("grammar_score", 100)))),
        "grammar_status": feedback.get("grammar_status", "Good"),
        "grammar_issues": [
            {
                "original": str(item.get("original", "")),
                "correction": str(item.get("correction", "")),
                "explanation": str(item.get("explanation", "")),
            }
            for item in feedback.get("grammar_issues", [])
            if isinstance(item, dict) and (item.get("correction") or item.get("original"))
        ],
        "grammar_exercises": [
            {
                "title": str(item.get("title", "Grammar Practice Drill")),
                "question": str(item.get("question", "")),
                "options": [str(opt) for opt in item.get("options", []) if isinstance(opt, (str, int))],
                "correct_answer": str(item.get("correct_answer", "")),
                "explanation": str(item.get("explanation", "")),
            }
            for item in feedback.get("grammar_exercises", [])
            if isinstance(item, dict) and item.get("question") and item.get("options")
        ],
    }}


class AIHandler(BaseHTTPRequestHandler):
    def do_POST(self) -> None:
        if self.path != "/analyze":
            self.send_error(404, "Not found")
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            if not isinstance(payload.get("question"), str) or not isinstance(payload.get("transcription"), str):
                raise ValueError("question and transcription are required")
            response = analyze(payload)
            self.send_json(200, response)
        except HTTPError as error:
            error_body = error.read().decode("utf-8", errors="replace")[:500]
            print(f"Groq HTTP {error.code}: {error_body}")
            self.send_json(502, {"message": "The Groq AI service rejected the request. Check GROQ_MODEL and GROQ_API_KEY."})
        except URLError as error:
            print(f"Groq connection error: {error.reason}")
            self.send_json(502, {"message": "The Groq AI service is temporarily unavailable."})
        except (ValueError, KeyError, json.JSONDecodeError) as error:
            self.send_json(400, {"message": str(error)})
        except RuntimeError as error:
            self.send_json(503, {"message": str(error)})
        except Exception:
            self.send_json(502, {"message": "The Python AI service returned invalid feedback."})

    def send_json(self, status: int, payload: dict) -> None:
        encoded = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)

    def log_message(self, format_string: str, *args: object) -> None:
        print(format_string % args)


if __name__ == "__main__":
    load_backend_env()
    print(f"Python AI service listening on http://{HOST}:{PORT}")
    ThreadingHTTPServer((HOST, PORT), AIHandler).serve_forever()
