<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin@bpoready.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('Admin@12345'),
                'role' => 'super_admin',
                'email_verified_at' => now(),
            ],
        );

        $defaultQuestions = [
            ['section' => 'paragraph', 'level' => 'easy', 'question' => 'Tell me about yourself.', 'status' => 'approved'],
            ['section' => 'paragraph', 'level' => 'easy', 'question' => 'Why do you want to work in the BPO industry?', 'status' => 'approved'],
            ['section' => 'paragraph', 'level' => 'medium', 'question' => 'How do you handle difficult customers?', 'status' => 'approved'],
            ['section' => 'paragraph', 'level' => 'medium', 'question' => 'How do you manage stress in a fast-paced environment?', 'status' => 'approved'],
            ['section' => 'paragraph', 'level' => 'hard', 'question' => 'Describe a situation where you had to resolve a conflict at work.', 'status' => 'approved'],
            ['section' => 'mock', 'level' => 'initial', 'question' => 'Tell me about yourself.', 'status' => 'approved'],
            ['section' => 'mock', 'level' => 'initial', 'question' => 'Why should we hire you?', 'status' => 'approved'],
            ['section' => 'mock', 'level' => 'final', 'question' => 'Describe a time you handled a difficult customer.', 'status' => 'approved'],
        ];

        foreach ($defaultQuestions as $item) {
            \App\Models\Question::firstOrCreate(
                [
                    'section' => $item['section'],
                    'level' => $item['level'],
                    'question' => $item['question'],
                ],
                [
                    'status' => 'approved',
                    'submitted_by_name' => 'System',
                ]
            );
        }
    }
}
