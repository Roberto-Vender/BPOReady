<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserAssessment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserAssessmentController extends Controller
{
    /**
     * Get all assessment records and progression for the specified user.
     */
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', strtolower($validated['email']))->first();

        if (!$user) {
            return response()->json([
                'assessment' => null,
                'levels' => [],
                'history' => [],
            ]);
        }

        $allAttempts = UserAssessment::where('user_id', $user->id)
            ->latest()
            ->get();

        // Baseline pre-assessment (latest attempt)
        $assessment = $allAttempts->firstWhere('level', 'assessment');

        // Level results (latest score for each level)
        $levels = [];
        foreach (['easy', 'medium', 'hard'] as $lvl) {
            $latest = $allAttempts->firstWhere('level', $lvl);
            if ($latest) {
                $levels[$lvl] = $latest;
            }
        }

        return response()->json([
            'assessment' => $assessment,
            'levels' => $levels,
            'history' => $allAttempts,
        ]);
    }

    /**
     * Store a completed assessment or paragraph reading attempt.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'level' => ['required', 'string', 'in:assessment,easy,medium,hard'],
            'score' => ['required', 'integer', 'min:0', 'max:100'],
            'total_words' => ['nullable', 'integer'],
            'words_per_minute' => ['nullable', 'integer'],
            'filler_penalty' => ['nullable', 'integer'],
            'pronunciation_penalty' => ['nullable', 'integer'],
            'pace_penalty' => ['nullable', 'integer'],
            'fillers' => ['nullable', 'array'],
            'filler_counts' => ['nullable', 'array'],
            'wrong_words' => ['nullable', 'array'],
            'transcription' => ['nullable', 'string'],
            'details' => ['nullable', 'array'],
        ]);

        $user = User::where('email', strtolower($validated['email']))->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $assessment = UserAssessment::create([
            'user_id' => $user->id,
            'level' => $validated['level'],
            'score' => $validated['score'],
            'total_words' => $validated['total_words'] ?? null,
            'words_per_minute' => $validated['words_per_minute'] ?? null,
            'filler_penalty' => $validated['filler_penalty'] ?? 0,
            'pronunciation_penalty' => $validated['pronunciation_penalty'] ?? 0,
            'pace_penalty' => $validated['pace_penalty'] ?? 0,
            'fillers' => $validated['fillers'] ?? [],
            'filler_counts' => $validated['filler_counts'] ?? [],
            'wrong_words' => $validated['wrong_words'] ?? [],
            'transcription' => $validated['transcription'] ?? '',
            'details' => $validated['details'] ?? [],
            'completed_at' => now(),
        ]);

        return response()->json([
            'message' => 'Assessment saved successfully.',
            'assessment' => $assessment,
        ], 201);
    }
}
