<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\InterviewFeedbackController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\UserAssessmentController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/admin/login', [AuthController::class, 'adminLogin']);
Route::get('/admin/users', [AuthController::class, 'adminUsers']);
Route::post('/admin/accounts', [AuthController::class, 'createAdmin']);
Route::get('/profile', [AuthController::class, 'profile']);
Route::patch('/profile', [AuthController::class, 'updateProfile']);
Route::put('/profile/password', [AuthController::class, 'changePassword']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/interview/feedback', [InterviewFeedbackController::class, 'analyze']);

// User Assessment endpoints (Per-user database progress tracking)
Route::get('/user/assessments', [UserAssessmentController::class, 'index']);
Route::post('/user/assessments', [UserAssessmentController::class, 'store']);

// Question endpoints
Route::get('/questions', [QuestionController::class, 'index']);
Route::get('/admin/questions', [QuestionController::class, 'adminIndex']);
Route::post('/admin/questions', [QuestionController::class, 'store']);
Route::patch('/admin/questions/{id}/status', [QuestionController::class, 'updateStatus']);
Route::delete('/admin/questions/{id}', [QuestionController::class, 'destroy']);