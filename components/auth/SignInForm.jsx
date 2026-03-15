"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { GoogleButton } from "../ui/GoogleButton";
import { signIn, signInWithGoogle } from "../../lib/actions/auth";

export function SignInForm() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  let decodedUrlError = null;
  if (urlError) {
    try {
      decodedUrlError = decodeURIComponent(urlError);
    } catch {
      decodedUrlError = urlError;
    }
  }
  const [error, setError] = useState(decodedUrlError);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signIn(new FormData(e.target));
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    const result = await signInWithGoogle();
    if (result?.error) setError(result.error);
  }

  return (
    <form className="mt-12 space-y-8" onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Input
          id="email"
          name="email"
          label="Your email"
          type="email"
          placeholder="Enter your email"
          required
        />
        <Input
          id="password"
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded-none border-celestique-taupe text-celestique-dark focus:ring-celestique-dark bg-transparent"
          />
          <label htmlFor="remember-me" className="ml-3 block text-[10px] uppercase tracking-[0.2em] text-celestique-dark/60">
            Remember me
          </label>
        </div>
        <div className="text-[10px] uppercase tracking-[0.2em]">
          <Link href="#" className="text-celestique-dark/60 hover:text-celestique-dark transition-colors">
            Forgot password?
          </Link>
        </div>
      </div>

      {error && (
        <p className="text-[10px] uppercase tracking-[0.1em] text-red-600 bg-red-50 border border-red-200 px-4 py-3">
          {error}
        </p>
      )}

      <Button type="submit" variant="primary" loading={loading}>
        Sign In
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-celestique-taupe" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]">
          <span className="bg-celestique-cream px-4 text-celestique-dark/40">OR</span>
        </div>
      </div>

      <GoogleButton onClick={handleGoogle} text="Sign in with Google" />

      <p className="mt-8 text-center text-[10px] uppercase tracking-[0.2em] text-celestique-dark/60">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-celestique-dark border-b border-celestique-dark pb-0.5 hover:text-celestique-dark/60 hover:border-celestique-dark/60 transition-colors ml-2"
        >
          SIGN UP
        </Link>
      </p>
    </form>
  );
}
