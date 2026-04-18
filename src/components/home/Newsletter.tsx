"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubmitStatus = "idle" | "success" | "error";

export function Newsletter(): React.JSX.Element {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const isValid = EMAIL_REGEX.test(email);
  const showError = touched && !isValid && email.length > 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    setStatus("success");
    setEmail("");
    setTouched(false);
  };

  return (
    <section className="bg-byredo-black text-byredo-white px-6 py-24 md:px-12">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-4xl tracking-wider uppercase mb-4">
          Stay Connected
        </h2>
        <p className="text-byredo-gray-400 text-sm leading-relaxed mb-10">
          Subscribe to receive exclusive access to new collections, events and
          brand stories.
        </p>

        {status === "success" ? (
          <p className="text-xs tracking-widest uppercase text-byredo-gray-300">
            Thank you for subscribing.
          </p>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex gap-0 border-b border-byredo-gray-600">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="Your email address"
                className={cn(
                  "flex-1 bg-transparent text-sm py-3 pr-4 outline-none placeholder:text-byredo-gray-600 text-byredo-white",
                  showError && "text-red-400"
                )}
                aria-describedby={showError ? "email-error" : undefined}
              />
              <button
                type="submit"
                className="text-xs tracking-widest uppercase py-3 hover:text-byredo-gray-400 transition-colors duration-200 whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
            {showError && (
              <p id="email-error" role="alert" className="mt-2 text-xs text-red-400 text-left">
                Please enter a valid email address.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
