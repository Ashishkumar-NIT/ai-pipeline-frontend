"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";

const OTP_VALIDITY_SECONDS = 60;  // OTP expires in 60 seconds
const RESEND_COOLDOWN_SECONDS = 30; // wait between resends
const MAX_RESENDS = 5;

/**
 * OtpForm — 8-digit OTP entry with:
 * - Box-per-digit input
 * - 60s countdown (OTP validity) — disappears on wrong OTP
 * - 30s resend cooldown
 * - Max 5 resends, then 24h lockout
 * - State persists across page refresh via sessionStorage + server rate limits
 */
export function OtpForm() {
  const router = useRouter();
  const [digits, setDigits] = useState(["", "", "", "", "", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState(null);
  const [isWrongOtp, setIsWrongOtp] = useState(false);

  // Timers
  const [otpSecondsLeft, setOtpSecondsLeft] = useState(OTP_VALIDITY_SECONDS);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showStopwatch, setShowStopwatch] = useState(true);

  // Rate limit state
  const [remainingResends, setRemainingResends] = useState(MAX_RESENDS);
  const [lockedUntil, setLockedUntil] = useState(null);

  // Identity from sessionStorage
  const [identity, setIdentity] = useState(null);
  const [isPhoneIdentity, setIsPhoneIdentity] = useState(false);

  const inputRefs = useRef([]);
  const otpTimerRef = useRef(null);
  const resendTimerRef = useRef(null);

  // ── Restore state on mount ─────────────────────────────────────────────────
  useEffect(() => {
    const storedIdentity = sessionStorage.getItem("auth_identity");
    const storedSentAt = sessionStorage.getItem("otp_sent_at");
    const storedRemainingResends = sessionStorage.getItem("otp_remaining_resends");
    const storedLockedUntil = sessionStorage.getItem("otp_locked_until");

    if (!storedIdentity) {
      // No identity — user landed here without going through entry
      router.replace("/entry_page/signup");
      return;
    }

    setIdentity(storedIdentity);
    setIsPhoneIdentity(/^\+\d{10,15}$/.test(storedIdentity)); // detect phone vs email

    if (storedLockedUntil) {
      const lockDate = new Date(storedLockedUntil);
      if (new Date() < lockDate) {
        setLockedUntil(storedLockedUntil);
        setRemainingResends(0);
        setShowStopwatch(false);
        return;
      } else {
        // Lock expired
        sessionStorage.removeItem("otp_locked_until");
      }
    }

    if (storedRemainingResends !== null) {
      setRemainingResends(parseInt(storedRemainingResends, 10));
    }

    // Calculate remaining OTP validity from sentAt
    if (storedSentAt) {
      const sentAt = new Date(storedSentAt);
      const elapsed = Math.floor((new Date() - sentAt) / 1000);
      const remaining = OTP_VALIDITY_SECONDS - elapsed;
      if (remaining > 0) {
        setOtpSecondsLeft(remaining);
        setShowStopwatch(true);
      } else {
        setOtpSecondsLeft(0);
        setShowStopwatch(false);
      }
    }
  }, [router]);

  // ── OTP validity countdown ─────────────────────────────────────────────────
  useEffect(() => {
    if (!showStopwatch || otpSecondsLeft <= 0) return;

    otpTimerRef.current = setInterval(() => {
      setOtpSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(otpTimerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(otpTimerRef.current);
  }, [showStopwatch]);

  // ── Resend cooldown countdown ─────────────────────────────────────────────
  useEffect(() => {
    if (resendCooldown <= 0) return;

    resendTimerRef.current = setInterval(() => {
      setResendCooldown((s) => {
        if (s <= 1) {
          clearInterval(resendTimerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(resendTimerRef.current);
  }, [resendCooldown]);

  // ── Format time as MM:SS ───────────────────────────────────────────────────
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  // ── OTP input handlers ─────────────────────────────────────────────────────
  function handleDigitChange(index, value) {
    // Only allow single digit
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    setError(null);
    setIsWrongOtp(false);

    if (char && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 7) inputRefs.current[index + 1]?.focus();
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 8);
    if (!pasted) return;
    const next = [...digits];
    pasted.split("").forEach((char, i) => {
      if (i < 8) next[i] = char;
    });
    setDigits(next);
    const lastFilledIndex = Math.min(pasted.length, 7);
    inputRefs.current[lastFilledIndex]?.focus();
  }

  // ── Verify OTP ─────────────────────────────────────────────────────────────
  async function handleVerify(e) {
    e.preventDefault();
    const token = digits.join("");
    if (token.length !== 8) {
      setError("Please enter the complete 8-digit code.");
      return;
    }
    if (!identity) {
      router.replace("/entry_page/signup");
      return;
    }

    setVerifying(true);
    setError(null);

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identity, token }),
    });
    const data = await res.json();

    if (!res.ok || data.error) {
      setIsWrongOtp(true);
      setShowStopwatch(false); // stopwatch disappears on wrong OTP
      clearInterval(otpTimerRef.current);
      setError(data.error || "Invalid OTP. Please try again or resend.");
      setDigits(["", "", "", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setVerifying(false);
      return;
    }

    // Success — route based on user status
    if (data.isNewUser) {
      router.push("/entry_page/signup/set-password");
    } else {
      router.push("/dashboard/wholesaler");
    }
  }

  // ── Resend OTP ─────────────────────────────────────────────────────────────
  async function handleResend() {
    if (!identity || resendCooldown > 0 || remainingResends <= 0 || lockedUntil) return;

    setResending(true);
    setError(null);

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identity }),
    });
    const data = await res.json();

    if (!res.ok) {
      if (data.locked) {
        setLockedUntil(data.lockedUntil);
        sessionStorage.setItem("otp_locked_until", data.lockedUntil);
        setRemainingResends(0);
        sessionStorage.setItem("otp_remaining_resends", "0");
      } else if (data.cooldown) {
        setResendCooldown(data.waitSeconds || RESEND_COOLDOWN_SECONDS);
      }
      setError(data.error);
      setResending(false);
      return;
    }

    // Success — reset timers
    const now = new Date().toISOString();
    sessionStorage.setItem("otp_sent_at", now);
    const newRemaining = data.remainingResends ?? Math.max(0, remainingResends - 1);
    setRemainingResends(newRemaining);
    sessionStorage.setItem("otp_remaining_resends", String(newRemaining));

    // Restart OTP validity countdown
    setOtpSecondsLeft(OTP_VALIDITY_SECONDS);
    setShowStopwatch(true);
    setIsWrongOtp(false);
    setDigits(["", "", "", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();

    // Start resend cooldown
    setResendCooldown(RESEND_COOLDOWN_SECONDS);

    setResending(false);
  }

  const otpComplete = digits.every(Boolean) && digits.length === 8;
  const isLocked = !!lockedUntil && new Date() < new Date(lockedUntil);

  return (
    <div className="mt-10 space-y-8">
      {/* Identity display */}
      {identity && (
        <div className="flex items-center gap-2 animate-fade-in">
          <div className="w-1.5 h-1.5 rounded-full bg-celestique-dark/40" />
          <p className="text-[10px] uppercase tracking-[0.2em] text-celestique-dark/50">
            OTP sent to <span className="text-celestique-dark font-semibold">{identity}</span>
          </p>
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-8">
        {/* OTP Digit Boxes */}
        <div className="flex gap-3 justify-center" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              id={`otp-digit-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`
                w-12 h-14 text-center text-xl font-bold border-b-2 bg-transparent transition-all duration-200
                focus:outline-none focus:border-celestique-dark
                ${digit ? "border-celestique-dark text-celestique-dark" : "border-celestique-taupe text-celestique-dark/40"}
                ${isWrongOtp ? "border-red-400 text-red-500" : ""}
                ${!isWrongOtp && digit ? "border-celestique-dark" : ""}
              `}
              autoFocus={i === 0}
            />
          ))}
        </div>

        {/* OTP Validity Countdown (stopwatch) */}
        {showStopwatch && otpSecondsLeft > 0 && (
          <div className="flex flex-col items-center gap-1 animate-fade-in">
            <p className="text-[9px] uppercase tracking-[0.2em] text-celestique-dark/40">
              OTP valid for
            </p>
            <p
              className={`text-3xl font-bold tracking-widest tabular-nums transition-colors duration-300 ${
                otpSecondsLeft <= 10
                  ? "text-red-500"
                  : "text-celestique-dark"
              }`}
            >
              {formatTime(otpSecondsLeft)}
            </p>
          </div>
        )}

        {otpSecondsLeft === 0 && !isWrongOtp && showStopwatch && (
          <p className="text-center text-[10px] uppercase tracking-[0.2em] text-celestique-dark/50 animate-fade-in">
            OTP expired — please resend.
          </p>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-start gap-2 animate-fade-in">
            <span className="shrink-0 w-1 h-1 rounded-full bg-red-500 mt-1.5" />
            <p className="text-[10px] uppercase tracking-[0.1em] text-red-600 leading-relaxed">
              {isWrongOtp
                ? `Wrong OTP — try resending or check your ${isPhoneIdentity ? 'SMS messages' : 'email'} for the correct code.`
                : error}
            </p>
          </div>
        )}

        {/* Locked state */}
        {isLocked && (
          <div className="border border-red-200 bg-red-50 px-4 py-3 animate-fade-in">
            <p className="text-[10px] uppercase tracking-[0.1em] text-red-600">
              All 5 resend attempts used. OTP requests for this identity are locked for 24 hours.
            </p>
          </div>
        )}

        {/* Resend section */}
        {!isLocked && (
          <div className="flex flex-col items-center gap-3">
            {/* Resend cooldown */}
            {resendCooldown > 0 && (
              <p className="text-[9px] uppercase tracking-[0.2em] text-celestique-dark/40">
                Next OTP available in{" "}
                <span className="font-bold text-celestique-dark tabular-nums">
                  {resendCooldown}s
                </span>
              </p>
            )}

            <button
              type="button"
              onClick={handleResend}
              disabled={resending || resendCooldown > 0 || remainingResends <= 0}
              className="text-[10px] uppercase tracking-[0.2em] text-celestique-dark border-b border-celestique-dark/40 pb-0.5 transition-all hover:border-celestique-dark disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {resending ? "Sending…" : "Resend OTP"}
            </button>

            {remainingResends > 0 && remainingResends < MAX_RESENDS && (
              <p className="text-[9px] uppercase tracking-[0.15em] text-celestique-dark/40">
                <span className="text-celestique-dark font-bold">{remainingResends}</span>{" "}
                resend{remainingResends === 1 ? "" : "s"} remaining
              </p>
            )}
          </div>
        )}

        {/* Verify Button */}
        <Button
          type="submit"
          variant="primary"
          loading={verifying}
          disabled={!otpComplete || verifying}
          id="otp-verify-btn"
        >
          Verify OTP
        </Button>
      </form>

      {/* Back to entry */}
      <button
        type="button"
        onClick={() => router.replace("/entry_page/signup")}
        className="w-full text-center text-[9px] uppercase tracking-[0.2em] text-celestique-dark/40 hover:text-celestique-dark transition-colors"
      >
        ← Use a different email
      </button>
    </div>
  );
}
