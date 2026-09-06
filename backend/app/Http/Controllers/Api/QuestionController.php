<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Question;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    /**
     * Get all approved questions grouped by section and level for applicant practice.
     */
    public function index(): JsonResponse
    {
        $questions = Question::approved()->orderBy('id', 'asc')->get();

        $grouped = [
            'paragraph' => [
                'easy' => [],
                'medium' => [],
                'hard' => [],
            ],
            'mock' => [
                'initial' => [],
                'final' => [],
            ],
        ];

        foreach ($questions as $q) {
            $grouped[$q->section][$q->level][] = [
                'id' => $q->id,
                'question' => $q->question,
                'status' => $q->status,
            ];
        }

        return response()->json($grouped);
    }

    /**
     * Get all questions with status, submitter info, and stats for Admin/Super Admin.
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $query = Question::query()->orderBy('created_at', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('section')) {
            $query->where('section', $request->query('section'));
        }

        if ($request->filled('level')) {
            $query->where('level', $request->query('level'));
        }

        $questions = $query->get();

        $counts = [
            'total' => Question::count(),
            'pending' => Question::pending()->count(),
            'approved' => Question::approved()->count(),
            'rejected' => Question::rejected()->count(),
        ];

        return response()->json([
            'questions' => $questions,
            'counts' => $counts,
        ]);
    }

    /**
     * Create / submit a new question.
     * Regular Admins submit with 'pending' status; Super Admins submit as 'approved'.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'section' => ['required', 'string', 'in:paragraph,mock'],
            'level' => ['required', 'string', 'in:easy,medium,hard,initial,final'],
            'question' => ['required', 'string', 'min:3', 'max:1000'],
            'role' => ['nullable', 'string', 'in:admin,super_admin'],
            'submitter_name' => ['nullable', 'string', 'max:255'],
            'submitter_email' => ['nullable', 'string', 'max:255'],
        ]);

        $isSuperAdmin = ($validated['role'] ?? 'admin') === 'super_admin';

        $question = Question::create([
            'section' => $validated['section'],
            'level' => $validated['level'],
            'question' => trim($validated['question']),
            'status' => $isSuperAdmin ? 'approved' : 'pending',
            'submitted_by_name' => $validated['submitter_name'] ?? ($isSuperAdmin ? 'Super Admin' : 'Admin'),
            'submitted_by_email' => $validated['submitter_email'] ?? null,
            'reviewed_by_name' => $isSuperAdmin ? ($validated['submitter_name'] ?? 'Super Admin') : null,
            'reviewed_at' => $isSuperAdmin ? now() : null,
        ]);

        return response()->json([
            'message' => $isSuperAdmin
                ? 'Question added and published directly.'
                : 'Question submitted successfully. It is now pending Super Admin review.',
            'question' => $question,
        ], 201);
    }

    /**
     * Super Admin approves or rejects a question.
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:approved,rejected'],
            'reviewer_name' => ['nullable', 'string', 'max:255'],
            'rejection_reason' => ['nullable', 'string', 'max:500'],
        ]);

        $question = Question::findOrFail($id);

        $question->update([
            'status' => $validated['status'],
            'reviewed_by_name' => $validated['reviewer_name'] ?? 'Super Admin',
            'reviewed_at' => now(),
            'rejection_reason' => $validated['status'] === 'rejected' ? ($validated['rejection_reason'] ?? null) : null,
        ]);

        return response()->json([
            'message' => $validated['status'] === 'approved'
                ? 'Question approved! It is now live for applicant practice.'
                : 'Question rejected.',
            'question' => $question,
        ]);
    }

    /**
     * Delete a question.
     */
    public function destroy(int $id): JsonResponse
    {
        $question = Question::findOrFail($id);
        $question->delete();

        return response()->json([
            'message' => 'Question deleted successfully.',
        ]);
    }
}
