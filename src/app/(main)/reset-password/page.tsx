"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase";

export default function ResetPasswordPage(): React.JSX.Element {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseClient();

    const checkSession = async (): Promise<void> => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setErrorMessage(error.message);
        return;
      }
      if (!data.session) {
        setErrorMessage(
          "Open this page from the reset email link, then set your new password."
        );
      }
    };

    void checkSession();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setErrorMessage("");
    setMessage("");

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setErrorMessage(error.message);
      } else {
        setMessage("Password updated successfully. You can now sign in.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[520px] items-center px-4 pt-[60px]">
      <div className="w-full border border-black/20 bg-white p-6 md:p-8">
        <h1 className="text-[22px] uppercase tracking-[0.14em] text-black">Reset Password</h1>
        <p className="mt-3 text-[11px] leading-6 tracking-[0.04em] text-black/65">
          Enter your new password. This page works only when opened from the reset email link.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-[10px] uppercase tracking-[0.16em] text-black/70">
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-[44px] w-full border border-black/20 px-4 text-[12px] outline-none focus:border-black"
          />

          <label className="block text-[10px] uppercase tracking-[0.16em] text-black/70">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="h-[44px] w-full border border-black/20 px-4 text-[12px] outline-none focus:border-black"
          />

          {errorMessage && (
            <p className="text-[11px] uppercase tracking-[0.06em] text-black">{errorMessage}</p>
          )}
          {message && (
            <p className="text-[11px] uppercase tracking-[0.06em] text-black/70">{message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full border border-black bg-black px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-black/50"
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>

        <Link
          href="/"
          className="mt-5 inline-block text-[10px] uppercase tracking-[0.14em] text-black/60 transition-opacity hover:opacity-60"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
