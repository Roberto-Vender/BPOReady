<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class InterviewFeedbackController extends Controller
{
    public function analyze(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'question' => ['required', 'string', 'max:1000'],
            'transcription' => ['required', 'string', 'max:12000'],
            'audio' => ['nullable', 'string', 'max:16000000'],
        ]);

        if (config('services.python_ai.url')) {
            try {
                $pythonResponse = Http::acceptJson()
                    ->timeout(3)
                    ->post(config('services.python_ai.url') . '/analyze', $validated);

                if ($pythonResponse->successful() && is_array($pythonResponse->json('feedback'))) {
                    return response()->json($pythonResponse->json());
                }
            } catch (\Throwable $exception) {
                // Python AI microservice is not active; fallback to direct Groq API call below
            }
        }

        if (!config('services.groq.key')) {
            return response()->json([
                'message' => 'AI feedback is not configured. Add GROQ_API_KEY to the backend/.env file.',
            ], 503);
        }

        $prompt = <<<'PROMPT'
You are an expert interview and English communication coach for BPO applicants. Analyze the answer against the question.
Check the transcript carefully for grammatical errors (e.g. subject-verb agreement, tenses, prepositions, articles, broken sentence structure).
Return only valid JSON with this exact shape:
{
  "overall_score": 0,
  "clarity": "Good|Needs improvement|Poor",
  "confidence": "High|Moderate|Low",
  "pacing": "Steady|Slightly fast|Slightly slow|Unable to assess",
  "filler_words": ["um", "uh"],
  "feedback": "short, specific paragraph",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "grammar_score": 100,
  "grammar_status": "Good|Needs Improvement|Poor",
  "grammar_issues": [
    {
      "original": "problematic phrase from transcript",
      "correction": "corrected professional phrasing",
      "explanation": "concise grammar explanation"
    }
  ],
  "grammar_exercises": [
    {
      "title": "Exercise Title",
      "question": "Fill in the blank or choose the best correction: ...",
      "options": ["Option A", "Option B", "Option C"],
      "correct_answer": "Option A",
      "explanation": "Why this answer is correct"
    }
  ]
}
Use a score from 0 to 100. If grammar has errors, generate 1-3 grammar_issues and 2 grammar_exercises targeting the errors. If no errors, set grammar_score=100, grammar_status="Good", grammar_issues=[], grammar_exercises=[].
If audio is provided, listen to it directly and include every occurrence in filler_words, including English fillers (um, umm, uh, uhhh, er, like, actually, basically, or you know) and Cebuano fillers (kuan, kanang, kana bitaw, bitaw, lagi, gud, ba, man, noh, no, aw, ambot, unsa, unsaon, and murag). Preserve each occurrence so the application can count them.
PROMPT;

        try {
            $apiKey = config('services.groq.key');
            $audioTranscription = '';

            if (!empty($validated['audio'])) {
                [, $audioData] = array_pad(explode(',', $validated['audio'], 2), 2, null);

                if ($audioData) {
                    $audioPath = tempnam(sys_get_temp_dir(), 'groq-audio-');
                    $decodedAudio = base64_decode($audioData, true);

                    if ($audioPath === false || $decodedAudio === false) {
                        throw new \RuntimeException('The recorded audio could not be decoded.');
                    }

                    file_put_contents($audioPath, $decodedAudio);
                    $audioFile = fopen($audioPath, 'r');

                    $transcriptionResponse = Http::withToken($apiKey)
                        ->timeout(60)
                        ->attach('file', $audioFile, 'interview.webm')
                        ->post('https://api.groq.com/openai/v1/audio/transcriptions', [
                            'model' => config('services.groq.transcription_model', 'whisper-large-v3-turbo'),
                            'response_format' => 'json',
                            'prompt' => 'Preserve filler words exactly, including um, umm, uh, uhhh, er, like, and you know.',
                        ])
                        ->throw();

                    fclose($audioFile);
                    unlink($audioPath);
                    $audioTranscription = $transcriptionResponse->json('text', '');
                }
            }

            $response = Http::withToken($apiKey)
                ->acceptJson()
                ->timeout(60)
                ->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model' => config('services.groq.model', 'openai/gpt-oss-20b'),
                    'temperature' => 0.2,
                    'response_format' => ['type' => 'json_object'],
                    'messages' => [
                        ['role' => 'system', 'content' => $prompt],
                        ['role' => 'user', 'content' => "Question:\n{$validated['question']}\n\nBrowser transcript:\n{$validated['transcription']}\n\nAudio transcript:\n{$audioTranscription}"],
                    ],
                ])
                ->throw();
        } catch (RequestException|ConnectionException $exception) {
            report($exception);

            if ($exception instanceof RequestException && $exception->response->status() === 429) {
                return response()->json([
                    'message' => 'The Groq AI quota has been exceeded. Check the API key limits, then try again.',
                ], 429);
            }

            if ($exception instanceof RequestException && $exception->response->status() === 404) {
                return response()->json([
                    'message' => 'The configured Groq model is unavailable. Check GROQ_MODEL in the backend environment.',
                ], 502);
            }

            return response()->json([
                'message' => 'The AI feedback service is temporarily unavailable.',
            ], 502);
        }

        $content = $response->json('choices.0.message.content')
            ?: $response->json('choices.0.message.reasoning');
        $feedback = json_decode($content, true);

        if (!is_array($feedback) && is_string($content)) {
            $jsonStart = strpos($content, '{');
            $jsonEnd = strrpos($content, '}');

            if ($jsonStart !== false && $jsonEnd !== false && $jsonEnd > $jsonStart) {
                $feedback = json_decode(substr($content, $jsonStart, $jsonEnd - $jsonStart + 1), true);
            }
        }

        if (!is_array($feedback)) {
            return response()->json([
                'message' => 'The AI returned an invalid feedback response.',
            ], 502);
        }

        return response()->json([
            'feedback' => [
                'overall_score' => max(0, min(100, (int) ($feedback['overall_score'] ?? 0))),
                'clarity' => $feedback['clarity'] ?? 'Unable to assess',
                'confidence' => $feedback['confidence'] ?? 'Unable to assess',
                'pacing' => $feedback['pacing'] ?? 'Unable to assess',
                'filler_words' => array_values(array_filter($feedback['filler_words'] ?? [], 'is_string')),
                'feedback' => $feedback['feedback'] ?? 'No written feedback was returned.',
                'suggestions' => array_values(array_filter($feedback['suggestions'] ?? [], 'is_string')),
                'grammar_score' => isset($feedback['grammar_score']) ? max(0, min(100, (int) $feedback['grammar_score'])) : 100,
                'grammar_status' => $feedback['grammar_status'] ?? 'Good',
                'grammar_issues' => is_array($feedback['grammar_issues'] ?? null) ? $feedback['grammar_issues'] : [],
                'grammar_exercises' => is_array($feedback['grammar_exercises'] ?? null) ? $feedback['grammar_exercises'] : [],
            ],
        ]);
    }
}