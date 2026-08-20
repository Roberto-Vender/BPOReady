import { useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
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
        throw new Error(data.message || "Unable to send reset code.");
      }

      setMessage(
        data.message || "A password reset code has been sent to your email."
      );
      setStep(2);
    } catch (requestError) {
      setError(
        requestError.message === "Failed to fetch"
          ? "Unable to connect to the Laravel server. Make sure it is running on port 8000."
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
      setError("Please enter the six-digit reset code.");
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
          email: email.trim().toLowerCase(),
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
          ? "Unable to connect to the Laravel server. Make sure it is running on port 8000."
          : requestError.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 font-poppins">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-gray-800">
          Forgot Password
        </h1>

        <p className="mb-6 text-sm text-gray-600">
          {step === 1 &&
            "Enter your email to receive a password reset code."}
          {step === 2 &&
            "Enter the code sent to your email and choose a new password."}
          {step === 3 && "Your password has been updated."}
        </p>

        {message && (
          <div className="mb-4 rounded bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={requestCode} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm text-gray-600"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your registered email"
                autoComplete="email"
                required
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={resetPassword} className="space-y-4">
            <div>
              <label
                htmlFor="code"
                className="mb-1 block text-sm text-gray-600"
              >
                Reset Code
              </label>

              <input
                id="code"
                type="text"
                inputMode="numeric"
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="Enter 6-digit code"
                autoComplete="one-time-code"
                maxLength={6}
                required
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="new-password"
                className="mb-1 block text-sm text-gray-600"
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
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-1 block text-sm text-gray-600"
              >
                Confirm New Password
              </label>

              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm your password"
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        )}

        {step === 3 && (
          <Link
            to="/Login"
            className="block w-full rounded bg-blue-600 px-5 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
          >
            Go to Login
          </Link>
        )}

        {step !== 3 && (
          <Link
            to="/Login"
            className="mt-5 block text-center text-sm text-blue-600 hover:underline"
          >
            Back to Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;