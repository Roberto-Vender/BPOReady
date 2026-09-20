<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'recovery_email' => ['nullable', 'string', 'email', 'max:255'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => strtolower($validated['email']),
            'password' => Hash::make($validated['password']),
            'recovery_email' => !empty($validated['recovery_email']) ? strtolower(trim($validated['recovery_email'])) : null,
        ]);

        return response()->json([
            'message' => 'Account created successfully.',
            'user' => $user,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', strtolower($validated['email']))->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password.',
            ], 401);
        }

        return response()->json([
            'message' => 'Login successful.',
            'user' => $user,
        ]);
    }

    public function adminLogin(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', strtolower($validated['email']))->first();

        if (!$user || !in_array($user->role, ['admin', 'super_admin'], true) || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid administrator credentials.',
            ], 401);
        }

        return response()->json([
            'message' => 'Administrator login successful.',
            'user' => $user,
        ]);
    }

    public function adminUsers(): JsonResponse
    {
        $users = User::query()
            ->select(['id', 'name', 'email', 'recovery_email', 'role', 'created_at'])
            ->latest()
            ->get();

        return response()->json([
            'total' => $users->count(),
            'users' => $users,
        ]);
    }

    public function createAdmin(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'creator_email' => ['required', 'email'],
            'current_password' => ['required', 'string'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'recovery_email' => ['nullable', 'string', 'email', 'max:255'],
        ]);

        $creator = User::where('email', strtolower($validated['creator_email']))->first();

        if (!$creator || $creator->role !== 'super_admin' || !Hash::check($validated['current_password'], $creator->password)) {
            return response()->json(['message' => 'Only a verified Super Admin can create administrator accounts.'], 403);
        }

        $admin = User::create([
            'name' => $validated['name'],
            'email' => strtolower($validated['email']),
            'password' => Hash::make($validated['password']),
            'role' => 'admin',
            'recovery_email' => !empty($validated['recovery_email']) ? strtolower(trim($validated['recovery_email'])) : null,
            'email_verified_at' => now(),
        ]);

        return response()->json([
            'message' => 'Administrator account created successfully.',
            'user' => $admin,
        ], 201);
    }

    public function profile(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', strtolower($validated['email']))->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        return response()->json(['user' => $user]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'recovery_email' => ['nullable', 'email', 'max:255'],
        ]);

        $user = User::where('email', strtolower($validated['email']))->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $updateData = [];

        if ($request->has('name')) {
            $updateData['name'] = $validated['name'];
        }

        if ($request->has('recovery_email')) {
            $updateData['recovery_email'] = !empty($validated['recovery_email'])
                ? strtolower(trim($validated['recovery_email']))
                : null;
        }

        $user->update($updateData);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user' => $user->fresh(),
        ]);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::where('email', strtolower($validated['email']))->first();

        if (!$user || !Hash::check($validated['current_password'], $user->password)) {
            return response()->json(['message' => 'Current password is incorrect.'], 422);
        }

        $user->update(['password' => Hash::make($validated['password'])]);

        return response()->json(['message' => 'Password updated successfully.']);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $inputEmail = strtolower($validated['email']);
        $user = User::where('email', $inputEmail)
            ->orWhere('recovery_email', $inputEmail)
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'If an account exists for that email, a reset code has been sent.',
            ]);
        }

        $code = (string) random_int(100000, 999999);
        $recipientEmail = !empty($user->recovery_email) ? $user->recovery_email : $user->email;
        $isRecovery = !empty($user->recovery_email);

        // Store reset token under user's primary account email
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            [
                'token' => Hash::make($code),
                'created_at' => now(),
            ]
        );

        // Also index under inputEmail if different from primary email
        if ($inputEmail !== $user->email) {
            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $inputEmail],
                [
                    'token' => Hash::make($code),
                    'created_at' => now(),
                ]
            );
        }

        try {
            Mail::raw(
                "Hello {$user->name},\n\n"
                . "We received a request to recover and reset the password for your BPOReady account ({$user->email}).\n\n"
                . "Your 6-digit password recovery code is: {$code}\n\n"
                . "This code will expire in 15 minutes. If you did not request a password reset, you can safely ignore this email.\n\n"
                . "Best regards,\nBPOReady Security Team",
                function ($message) use ($recipientEmail): void {
                    $message->to($recipientEmail)->subject('BPOReady - Account Recovery Code');
                }
            );
        } catch (\Throwable $mailException) {
            \Illuminate\Support\Facades\Log::error('SMTP Mail Sending Failed: ' . $mailException->getMessage());
            \Illuminate\Support\Facades\Log::info("Recovery Code for {$user->email} (sent to {$recipientEmail}): {$code}");

            return response()->json([
                'message' => 'Failed to send recovery email. Google rejected your SMTP credentials. Please generate a new 16-character Google App Password and update MAIL_PASSWORD in backend/.env.',
            ], 500);
        }

        $maskedRecipient = self::maskEmail($recipientEmail);

        return response()->json([
            'message' => $isRecovery
                ? "A six-digit recovery code has been sent to your recovery email ({$maskedRecipient})."
                : "A six-digit recovery code has been sent to your email ({$maskedRecipient}).",
            'account_email' => $user->email,
            'sent_to' => $maskedRecipient,
            'is_recovery_email' => $isRecovery,
        ]);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'code' => ['required', 'digits:6'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $inputEmail = strtolower($validated['email']);
        $user = User::where('email', $inputEmail)
            ->orWhere('recovery_email', $inputEmail)
            ->first();

        if (!$user) {
            return response()->json(['message' => 'The reset code is invalid or has expired.'], 422);
        }

        // Check reset token for the user's primary email or input email
        $reset = DB::table('password_reset_tokens')
            ->where('email', $user->email)
            ->orWhere('email', $inputEmail)
            ->first();

        if (!$reset || !$reset->created_at || now()->diffInMinutes($reset->created_at) > 15 || !Hash::check($validated['code'], $reset->token)) {
            return response()->json(['message' => 'The reset code is invalid or has expired.'], 422);
        }

        $user->update(['password' => Hash::make($validated['password'])]);

        // Clean up reset tokens
        DB::table('password_reset_tokens')->where('email', $user->email)->delete();
        DB::table('password_reset_tokens')->where('email', $inputEmail)->delete();

        return response()->json(['message' => 'Password reset successfully. You can now log in with your new password.']);
    }

    /**
     * Mask email address for user privacy (e.g. j***n@gmail.com).
     */
    private static function maskEmail(string $email): string
    {
        $parts = explode('@', $email);
        if (count($parts) !== 2) {
            return $email;
        }

        $name = $parts[0];
        $domain = $parts[1];

        if (strlen($name) <= 2) {
            $maskedName = substr($name, 0, 1) . '***';
        } else {
            $maskedName = substr($name, 0, 1) . str_repeat('*', min(5, strlen($name) - 2)) . substr($name, -1);
        }

        return $maskedName . '@' . $domain;
    }
}