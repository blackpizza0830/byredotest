"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AuthClient, AuthMode, AuthUser } from "@/types/auth";

interface AuthModalProps {
  open: boolean;
  mode: AuthMode;
  authClient: AuthClient;
  onClose: () => void;
  onModeChange: (mode: AuthMode) => void;
  onAuthSuccess?: (user: AuthUser) => void;
}

interface SignInFormState {
  email: string;
  password: string;
}

interface SignUpFormState extends SignInFormState {
  fullName: string;
  confirmPassword: string;
}

const SIGN_IN_INITIAL_STATE: SignInFormState = {
  email: "",
  password: "",
};

const SIGN_UP_INITIAL_STATE: SignUpFormState = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function AuthModal({
  open,
  mode,
  authClient,
  onClose,
  onModeChange,
  onAuthSuccess,
}: AuthModalProps): React.JSX.Element {
  const [signInForm, setSignInForm] = useState<SignInFormState>(SIGN_IN_INITIAL_STATE);
  const [signUpForm, setSignUpForm] = useState<SignUpFormState>(SIGN_UP_INITIAL_STATE);
  const [submitError, setSubmitError] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return (): void => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setSubmitError("");
      setStatusMessage("");
      setIsSubmitting(false);
    }
  }, [open]);

  const modeCopy = useMemo(
    () =>
      mode === "signUp"
        ? {
            title: "Create Account",
            subtitle: "Join BYREDO and unlock curated member experiences.",
            submitLabel: "Create Account",
            switchLabel: "Already have an account?",
            switchActionLabel: "Sign In",
          }
        : {
            title: "Welcome Back",
            subtitle: "Sign in to continue your BYREDO experience.",
            submitLabel: "Sign In",
            switchLabel: "New to BYREDO?",
            switchActionLabel: "Create Account",
          },
    [mode]
  );

  const closeWithReset = (): void => {
    setSubmitError("");
    setStatusMessage("");
    setSignInForm(SIGN_IN_INITIAL_STATE);
    setSignUpForm(SIGN_UP_INITIAL_STATE);
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setSubmitError("");
    setStatusMessage("");

    if (mode === "signIn") {
      if (!isValidEmail(signInForm.email)) {
        setSubmitError("Please enter a valid email address.");
        return;
      }
      if (!signInForm.password) {
        setSubmitError("Password is required.");
        return;
      }
      try {
        setIsSubmitting(true);
        const result = await authClient.signIn(signInForm);
        onAuthSuccess?.(result.user);
        closeWithReset();
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : "Unable to sign in.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!signUpForm.fullName.trim()) {
      setSubmitError("Full name is required.");
      return;
    }
    if (!isValidEmail(signUpForm.email)) {
      setSubmitError("Please enter a valid email address.");
      return;
    }
    if (signUpForm.password.length < 8) {
      setSubmitError("Password must be at least 8 characters.");
      return;
    }
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setSubmitError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await authClient.signUp({
        fullName: signUpForm.fullName.trim(),
        email: signUpForm.email,
        password: signUpForm.password,
      });
      onAuthSuccess?.(result.user);
      closeWithReset();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (): void => {
    setSubmitError("");
    setStatusMessage("");
    onModeChange(mode === "signIn" ? "signUp" : "signIn");
  };

  const handleForgotPassword = async (): Promise<void> => {
    setSubmitError("");
    setStatusMessage("");

    if (!isValidEmail(signInForm.email)) {
      setSubmitError("Enter your email first, then request password reset.");
      return;
    }

    try {
      setIsSubmitting(true);
      await authClient.requestPasswordReset(signInForm.email.trim());
      setStatusMessage("Password reset email sent. Check your inbox.");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to send reset email."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/35"
            aria-label="Close authentication modal"
            onClick={closeWithReset}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            className="relative z-10 w-full max-w-[480px] border border-black bg-white p-6 shadow-[0_30px_70px_rgba(0,0,0,0.14)] md:p-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="mb-7 flex items-start justify-between">
              <div>
                <h2 id="auth-modal-title" className="text-[22px] uppercase tracking-[0.14em] text-black">
                  {modeCopy.title}
                </h2>
                <p className="mt-3 max-w-[320px] text-[11px] leading-[1.6] tracking-[0.04em] text-black/65">
                  {modeCopy.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={closeWithReset}
                aria-label="Close authentication modal"
                className="rounded-sm p-1 text-black transition-opacity hover:opacity-60"
              >
                <X size={20} strokeWidth={1.6} aria-hidden />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {mode === "signUp" && (
                <InputField
                  label="Full Name"
                  type="text"
                  value={signUpForm.fullName}
                  onChange={(value) =>
                    setSignUpForm((prev) => ({
                      ...prev,
                      fullName: value,
                    }))
                  }
                  autoComplete="name"
                />
              )}

              <InputField
                label="Email"
                type="email"
                value={mode === "signIn" ? signInForm.email : signUpForm.email}
                onChange={(value) => {
                  if (mode === "signIn") {
                    setSignInForm((prev) => ({
                      ...prev,
                      email: value,
                    }));
                    return;
                  }
                  setSignUpForm((prev) => ({
                    ...prev,
                    email: value,
                  }));
                }}
                autoComplete="email"
              />

              <InputField
                label="Password"
                type="password"
                value={mode === "signIn" ? signInForm.password : signUpForm.password}
                onChange={(value) => {
                  if (mode === "signIn") {
                    setSignInForm((prev) => ({
                      ...prev,
                      password: value,
                    }));
                    return;
                  }
                  setSignUpForm((prev) => ({
                    ...prev,
                    password: value,
                  }));
                }}
                autoComplete={mode === "signIn" ? "current-password" : "new-password"}
              />

              {mode === "signUp" && (
                <InputField
                  label="Confirm Password"
                  type="password"
                  value={signUpForm.confirmPassword}
                  onChange={(value) =>
                    setSignUpForm((prev) => ({
                      ...prev,
                      confirmPassword: value,
                    }))
                  }
                  autoComplete="new-password"
                />
              )}

              {mode === "signIn" && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      void handleForgotPassword();
                    }}
                    disabled={isSubmitting}
                    className="text-[10px] uppercase tracking-[0.14em] text-black/60 transition-opacity hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {submitError && (
                <p className="text-[11px] uppercase tracking-[0.06em] text-black">{submitError}</p>
              )}
              {statusMessage && (
                <p className="text-[11px] uppercase tracking-[0.06em] text-black/70">{statusMessage}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "mt-3 w-full border border-black bg-black px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-white transition-colors",
                  "hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-black/50"
                )}
              >
                {isSubmitting ? "Processing..." : modeCopy.submitLabel}
              </button>
            </form>

            <div className="mt-6 border-t border-black/10 pt-5 text-center">
              <p className="text-[10px] uppercase tracking-[0.14em] text-black/60">
                {modeCopy.switchLabel}
              </p>
              <button
                type="button"
                onClick={switchMode}
                className="mt-2 text-[11px] uppercase tracking-[0.22em] text-black transition-opacity hover:opacity-60"
              >
                {modeCopy.switchActionLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface InputFieldProps {
  label: string;
  type: "text" | "email" | "password";
  value: string;
  autoComplete: string;
  onChange: (value: string) => void;
}

function InputField({
  label,
  type,
  value,
  autoComplete,
  onChange,
}: InputFieldProps): React.JSX.Element {
  const inputId = useMemo(
    () => label.toLowerCase().replace(/\s+/g, "-"),
    [label]
  );

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-[10px] uppercase tracking-[0.18em] text-black/70">
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "h-[44px] w-full border border-black/20 bg-white px-4 text-[12px] tracking-[0.04em] text-black outline-none transition-colors",
          "placeholder:text-black/40 focus:border-black"
        )}
      />
    </div>
  );
}
