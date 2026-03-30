"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function EntryPage() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleContinue = async () => {
    if (!emailOrPhone.trim()) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .or(`email.eq.${emailOrPhone},phone.eq.${emailOrPhone}`)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.error("Error checking user:", error);
        setIsLoading(false);
        return;
      }

      if (data) {
        router.push("/entry_page/signin");
      } else {
        router.push("/entry_page/signup");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?mode=entry`,
        },
      });
      if (error) {
        console.error("Google sign in error:", error);
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Image
        src="https://res.cloudinary.com/dcs0vuzwg/image/upload/v1774883373/authImg_ivftu7.png"
        alt="Jewellery background"
        fill
        style={{ objectFit: "cover" }}
        priority
      />
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.30)" }} />

      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "420px", margin: "0 16px" }}>
        <div style={{ background: "rgba(255,255,255,0.97)", borderRadius: "16px", padding: "40px 36px 32px", boxShadow: "0 8px 48px rgba(0,0,0,0.20)" }}>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            <Image src="/jewelLogo.svg" alt="Jewels India logo" width={30} height={30} />
            <span style={{ fontFamily: "Gilroy, sans-serif", fontWeight: 600, fontSize: "17px", color: "#111111", letterSpacing: "0.01em" }}>
              Jewels India
            </span>
          </div>

          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "34px", fontWeight: 700, color: "#111111", lineHeight: 1.15, margin: "0 0 8px" }}>
            Welcome
          </h1>

          <p style={{ fontSize: "13px", color: "#666666", margin: "0 0 28px", lineHeight: 1.5 }}>
            Sign in to explore Jewellery all over India
          </p>

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="identity"
              style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#333333", marginBottom: "7px", letterSpacing: "0.01em" }}
            >
              Email or Phone number
            </label>
            <input
              id="identity"
              type="text"
              autoComplete="username"
              placeholder="Enter"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              style={{
                width: "100%",
                height: "46px",
                border: "1.5px solid #D9D0C5",
                borderRadius: "8px",
                padding: "0 14px",
                fontSize: "14px",
                color: "#111111",
                background: "#FAFAFA",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#111111")}
              onBlur={(e) => (e.target.style.borderColor = "#D9D0C5")}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
            <div style={{ flex: 1, height: "1px", background: "#D9D0C5" }} />
            <span style={{ fontSize: "11px", color: "#999999", fontWeight: 500, letterSpacing: "0.05em" }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "#D9D0C5" }} />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            style={{
              width: "100%",
              height: "46px",
              border: "1.5px solid #D9D0C5",
              borderRadius: "8px",
              background: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#111111",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.6 : 1,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = "#F5F5F5"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#FFFFFF"; }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M47.52 24.552c0-1.636-.148-3.21-.424-4.728H24v8.948h13.204c-.568 3.068-2.292 5.668-4.884 7.412v6.16h7.908C44.164 38.028 47.52 31.836 47.52 24.552z" fill="#4285F4"/>
              <path d="M24 48c6.636 0 12.204-2.2 16.268-5.968l-7.908-6.16c-2.196 1.472-5.004 2.34-8.36 2.34-6.428 0-11.872-4.34-13.824-10.172H2.04v6.36C6.084 42.916 14.46 48 24 48z" fill="#34A853"/>
              <path d="M10.176 28.04A14.41 14.41 0 0 1 9.6 24c0-1.404.24-2.768.576-4.04v-6.36H2.04A23.956 23.956 0 0 0 0 24c0 3.864.928 7.516 2.04 10.4l8.136-6.36z" fill="#FBBC05"/>
              <path d="M24 9.552c3.624 0 6.872 1.248 9.428 3.696l7.076-7.076C36.196 2.392 30.628 0 24 0 14.46 0 6.084 5.084 2.04 13.6l8.136 6.36C12.128 13.892 17.572 9.552 24 9.552z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          <div style={{ height: "28px" }} />

          <button
            type="button"
            onClick={handleContinue}
            disabled={isLoading || !emailOrPhone.trim()}
            style={{
              width: "100%",
              height: "48px",
              background: emailOrPhone.trim() && !isLoading ? "#111111" : "#888888",
              color: "#FFFFFF",
              borderRadius: "8px",
              border: "none",
              fontSize: "14px",
              fontWeight: 600,
              cursor: emailOrPhone.trim() && !isLoading ? "pointer" : "not-allowed",
              letterSpacing: "0.02em",
              transition: "background 0.2s",
              marginBottom: "20px",
            }}
            onMouseEnter={(e) => { if (emailOrPhone.trim() && !isLoading) e.currentTarget.style.background = "#2a2a2a"; }}
            onMouseLeave={(e) => { if (emailOrPhone.trim() && !isLoading) e.currentTarget.style.background = "#111111"; }}
          >
            {isLoading ? "Checking..." : "Continue"}
          </button>

          <p style={{ textAlign: "center", fontSize: "11px", color: "#888888", lineHeight: 1.65, margin: 0 }}>
            By continuing, you agree to our{" "}
            <span style={{ fontWeight: 700, color: "#333333", cursor: "pointer" }}>Terms of Service</span>{" "}
            and{" "}
            <span style={{ fontWeight: 700, color: "#333333", cursor: "pointer" }}>Privacy Policy</span>
          </p>

        </div>
      </div>
    </div>
  );
}
