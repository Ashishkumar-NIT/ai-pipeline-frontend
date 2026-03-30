"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "../ui/Button";
import { signIn } from "../../lib/actions/auth";

/**
 * SignInForm — for EXISTING users only.
 * Reached via redirect from the entry page after a DB check confirms the user exists.
 * Pre-fills the identity (email/phone) from URL param or sessionStorage.
 * No Google auth (handled on the entry page).
 */
export function SignInForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlError = searchParams.get("error");
  const urlIdentity = searchParams.get("identity");

  let decodedUrlError = null;
  if (urlError) {
    try { decodedUrlError = decodeURIComponent(urlError); }
    catch { decodedUrlError = urlError; }
  }

  const [error, setError] = useState(decodedUrlError);
  const [loading, setLoading] = useState(false);
  const [identity, setIdentity] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Restore identity from URL param or sessionStorage
  useEffect(() => {
    if (urlIdentity) {
      setIdentity(decodeURIComponent(urlIdentity));
      return;
    }
    const stored = sessionStorage.getItem("auth_identity");
    if (stored) setIdentity(stored);
  }, [urlIdentity]);

  // If no identity at all, redirect back to entry
  useEffect(() => {
    if (!urlIdentity) {
      const stored = sessionStorage.getItem("auth_identity");
      if (!stored) {
        router.replace("/signup");
      }
    }
  }, [urlIdentity, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.target);
    // Inject the identity as email (server action uses "email" field)
    formData.set("email", identity);

    const result = await signIn(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // On success, signIn server action redirects to /dashboard/wholesaler
  }

  return (
    <form className="mt-10 space-y-8" onSubmit={handleSubmit}>
      {/* Identity display — read only, shows who is signing in */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-celestique-dark/60">
          Signing in as
        </label>
        <div className="flex items-center justify-between h-14 border-b-2 border-celestique-dark/20">
          <span className="text-[15px] text-celestique-dark font-light tracking-wide truncate">
            {identity}
          </span>
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem("auth_identity");
              router.replace("/signup");
            }}
            className="shrink-0 ml-3 text-[9px] uppercase tracking-widest text-celestique-dark/40 hover:text-celestique-dark transition-colors border-b border-transparent hover:border-celestique-dark/40"
          >
            Change
          </button>
        </div>
      </div>

      {/* Password */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-[10px] uppercase tracking-[0.2em] font-bold text-celestique-dark/60"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            autoFocus
            required
            className="h-14 w-full border-b-2 bg-transparent border-celestique-taupe px-0 pr-12 text-[15px] text-celestique-dark placeholder:text-celestique-dark/30 focus:outline-none focus:border-celestique-dark transition-colors duration-300 font-light tracking-wide"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-[9px] uppercase tracking-widest text-celestique-dark/40 hover:text-celestique-dark transition-colors"
            tabIndex={-1}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {/* Forgot password */}
      <div className="text-right -mt-4">
        <button
          type="button"
          className="text-[9px] uppercase tracking-[0.2em] text-celestique-dark/40 border-b border-celestique-dark/20 pb-0.5 hover:text-celestique-dark hover:border-celestique-dark transition-colors"
        >
          Forgot password?
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 animate-fade-in">
          <span className="shrink-0 w-1 h-1 rounded-full bg-red-500 mt-1.5" />
          <p className="text-[10px] uppercase tracking-widest text-red-600">{error}</p>
        </div>
      )}

      <Button type="submit" variant="primary" loading={loading} id="signin-btn">
        Sign In
      </Button>
    </form>
  );
}
