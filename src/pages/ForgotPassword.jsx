import { useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [maskedSentTo, setMaskedSentTo] = useState("");
  const [isRecoveryEmail, setIsRecoveryEmail] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getResponseData = async (response) => {
    const text = await response.text();

    try {
      return text ? JSON.parse(text) : {};
    } catch {
      return {
        message: "The server returned an invalid response.",
      };
    }
  };

  const requestCode = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await getResponseData(response);

      if (!response.ok) {
        throw new Error(data.message || "Unable to send recovery code.");
      }

      setMaskedSentTo(data.sent_to || "");
      setIsRecoveryEmail(Boolean(data.is_recovery_email));
      if (data.account_email) {
        setAccountEmail(data.account_email);
      }

      setMessage(
        data.message || "A password recovery code has been sent."
      );
      setStep(2);
    } catch (requestError) {
      setError(
        requestError.message === "Failed to fetch"
          ? "Unable to connect to the server. Please check your internet connection or try again shortly."
          : requestError.message
      );
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(code)) {
      setError("Please enter the six-digit recovery code.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: (accountEmail || email).trim().toLowerCase(),
          code,
          password: newPassword,
          password_confirmation: confirmPassword,
        }),
      });

      const data = await getResponseData(response);

      if (!response.ok) {
        throw new Error(data.message || "Unable to reset password.");
      }

      setMessage(data.message || "Password reset successfully.");
      setStep(3);
    } catch (requestError) {
      setError(
        requestError.message === "Failed to fetch"
          ? "Unable to connect to the server. Please check your internet connection or try again shortly."
          : requestError.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 font-poppins">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        {/* Header Logo & Icon */}
        <div className="mb-6 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            {step === 3 ? "Password Reset Complete" : "Account Recovery"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {step === 1 && "Enter your registered email or recovery Gmail to receive a 6-digit verification code."}
            {step === 2 && (
              isRecoveryEmail && maskedSentTo
                ? `Verification code sent to your recovery email: ${maskedSentTo}`
                : maskedSentTo
                ? `Verification code sent to: ${maskedSentTo}`
                : "Enter the code sent to your email and set a new password."
            )}
            {step === 3 && "Your password has been updated. You can now log into your account."}
          </p>
        </div>

        {message && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs font-semibold text-green-800 flex items-start gap-2">
            <svg className="w-4 h-4 text-green-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-800 flex items-start gap-2">
            <svg className="w-4 h-4 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={requestCode} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-700"
              >
                Account Email or Recovery Gmail
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com or recovery@gmail.com"
                autoComplete="email"
                required
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
              />
              <p className="mt-1.5 text-[11px] text-gray-500">
                If you added a recovery Gmail to your profile, the 6-digit recovery code will automatically be delivered there.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 transition shadow-md"
            >
              {loading ? "Sending Recovery Code..." : "Send Recovery Code"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={resetPassword} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="code"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-700"
                >
                  6-Digit Recovery Code
                </label>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[11px] text-blue-600 hover:underline font-medium"
                >
                  Change Email
                </button>
              </div>

              <input
                id="code"
                type="text"
                inputMode="numeric"
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="123456"
                autoComplete="one-time-code"
                maxLength={6}
                required
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-center text-lg font-bold tracking-widest text-gray-800 placeholder-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
              />
            </div>

            <div>
              <label
                htmlFor="new-password"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-700"
              >
                New Password
              </label>

              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-700"
              >
                Confirm New Password
              </label>

              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your new password"
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 transition shadow-md"
            >
              {loading ? "Updating Password..." : "Reset Password"}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center py-2">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700">
                Your account password has been updated securely.
              </p>
            </div>

            <Link
              to="/Login"
              className="block w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700 transition shadow-md"
            >
              Log In to Account
            </Link>
          </div>
        )}

        {step !== 3 && (
          <div className="mt-6 border-t border-gray-100 pt-4 text-center">
            <Link
              to="/Login"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              ← Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;