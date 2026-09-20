<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('level'); // 'assessment', 'easy', 'medium', 'hard'
            $table->integer('score');
            $table->integer('total_words')->nullable();
            $table->integer('words_per_minute')->nullable();
            $table->integer('filler_penalty')->default(0);
            $table->integer('pronunciation_penalty')->default(0);
            $table->integer('pace_penalty')->default(0);
            $table->json('fillers')->nullable();
            $table->json('filler_counts')->nullable();
            $table->json('wrong_words')->nullable();
            $table->text('transcription')->nullable();
            $table->json('details')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'level']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_assessments');
    }
};
