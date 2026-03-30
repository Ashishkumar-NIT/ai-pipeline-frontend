"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";

const RULES = [
  { id: "length",  label: "At least 8 characters",            test: (p) => p.length >= 8 },
  { id: "upper",   label: "1 uppercase letter (A–Z)",         test: (p) => /[A-Z]/.test(p) },
  { id: "lower",   label: "1 lowercase letter (a–z)",         test: (p) => /[a-z]/.test(p) },
  { id: "number",  label: "1 number (0–9)",                   test: (p) => /\d/.test(p) },
  { id: "special", label: "1 special character (!@#$%^&*…)",  test: (p) => /[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]/.test(p) },
];

function getStrength(password) {
  const passed = RULES.filter((r) => r.test(password)).length;
  if (passed === 0) return { score: 0, label: "", color: "" };
  if (passed <= 2) return { score: passed, label: "Weak", color: "bg-red-400" };
  if (passed <= 3) return { score: passed, label: "Fair", color: "bg-amber-400" };
  if (passed <= 4) return { score: passed, label: "Good", color: "bg-sky-400" };
  return { score: passed, label: "Strong", color: "bg-emerald-500" };
}

/**
 * SetPasswordForm — after OTP verification.
 * User creates their password with live validation & strength indicator.
 */
export function SetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const strength = getStrength(password);
  const allRulesPassed = RULES.every((r) => r.test(password));
  const passwordsMatch = password === confirm;
  const canSubmit = allRulesPassed && passwordsMatch && password.length > 0;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/set-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();

    if (!res.ok || data.error) {
      setError(data.error || "Failed to set password. Please try again.");
      setLoading(false);
      return;
    }

    // Clean up session storage
    sessionStorage.removeItem("auth_identity");
    sessionStorage.removeItem("otp_sent_at");
    sessionStorage.removeItem("otp_remaining_resends");
    sessionStorage.removeItem("otp_locked_until");

    router.push("/onboard");
  }

  return (
    <form className="mt-10 space-y-8" onSubmit={handleSubmit}>

      {/* Password input */}
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
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(null); }}
            placeholder="Create a strong password"
            className="h-14 w-full border-b-2 bg-transparent border-celestique-taupe px-0 pr-12 text-[15px] text-celestique-dark placeholder:text-celestique-dark/30 focus:outline-none focus:border-celestique-dark transition-colors duration-300 font-light tracking-wide"
            autoComplete="new-password"
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

        {/* Strength bar */}
        {password && (
          <div className="space-y-1.5 animate-fade-in">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                    i <= strength.score ? strength.color : "bg-celestique-taupe"
                  }`}
                />
              ))}
            </div>
            {strength.label && (
              <p className="text-[9px] uppercase tracking-[0.2em] text-celestique-dark/50">
                Strength:{" "}
                <span
                  className={`font-bold ${
                    strength.label === "Strong"
                      ? "text-emerald-600"
                      : strength.label === "Good"
                      ? "text-sky-600"
                      : strength.label === "Fair"
                      ? "text-amber-600"
                      : "text-red-500"
                  }`}
                >
                  {strength.label}
                </span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Confirm password */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="confirm"
          className="text-[10px] uppercase tracking-[0.2em] font-bold text-celestique-dark/60"
        >
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirm"
            type={showConfirm ? "text" : "password"}
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); setError(null); }}
            placeholder="Re-enter your password"
            className={`h-14 w-full border-b-2 bg-transparent px-0 pr-12 text-[15px] placeholder:text-celestique-dark/30 focus:outline-none transition-colors duration-300 font-light tracking-wide ${
              confirm && !passwordsMatch
                ? "border-red-400 text-red-500"
                : confirm && passwordsMatch
                ? "border-emerald-400 text-celestique-dark"
                : "border-celestique-taupe text-celestique-dark focus:border-celestique-dark"
            }`}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-[9px] uppercase tracking-widest text-celestique-dark/40 hover:text-celestique-dark transition-colors"
            tabIndex={-1}
          >
            {showConfirm ? "Hide" : "Show"}
          </button>
        </div>
        {confirm && !passwordsMatch && (
          <p className="text-[9px] uppercase tracking-[0.15em] text-red-500 animate-fade-in">
            Passwords do not match
          </p>
        )}
        {confirm && passwordsMatch && (
          <p className="text-[9px] uppercase tracking-[0.15em] text-emerald-600 animate-fade-in">
            Passwords match ✓
          </p>
        )}
      </div>

      {/* Password rules checklist */}
      <div className="space-y-2">
        <p className="text-[9px] uppercase tracking-[0.2em] text-celestique-dark/40 mb-1">
          Password must include:
        </p>
        {RULES.map((rule) => {
          const passed = rule.test(password);
          return (
            <div key={rule.id} className="flex items-center gap-2">
              <div
                className={`w-1 h-1 rounded-full shrink-0 transition-colors duration-300 ${
                  passed ? "bg-emerald-500" : "bg-celestique-taupe"
                }`}
              />
              <p
                className={`text-[9px] uppercase tracking-[0.15em] transition-colors duration-300 ${
                  passed ? "text-celestique-dark/70" : "text-celestique-dark/30"
                }`}
              >
                {rule.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* API Error */}
      {error && (
        <div className="flex items-start gap-2 animate-fade-in">
          <span className="shrink-0 w-1 h-1 rounded-full bg-red-500 mt-1.5" />
          <p className="text-[10px] uppercase tracking-[0.1em] text-red-600">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        loading={loading}
        disabled={!canSubmit}
        id="set-password-btn"
      >
        Create Account
      </Button>
    </form>
  );
}
