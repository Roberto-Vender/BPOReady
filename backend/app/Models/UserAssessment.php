<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserAssessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'level',
        'score',
        'total_words',
        'words_per_minute',
        'filler_penalty',
        'pronunciation_penalty',
        'pace_penalty',
        'fillers',
        'filler_counts',
        'wrong_words',
        'transcription',
        'details',
        'completed_at',
    ];

    protected $casts = [
        'score' => 'integer',
        'total_words' => 'integer',
        'words_per_minute' => 'integer',
        'filler_penalty' => 'integer',
        'pronunciation_penalty' => 'integer',
        'pace_penalty' => 'integer',
        'fillers' => 'array',
        'filler_counts' => 'array',
        'wrong_words' => 'array',
        'details' => 'array',
        'completed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
