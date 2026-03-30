"use client";
import { useRouter } from "next/navigation";
import { useOnboard } from "../../../context/OnboardContext";
import { createClient } from "../../../lib/supabase/client";

export function Step3Footer({ isFormValid, onSubmitAttempt }) {
  const router = useRouter();
  const {
    name, aadhar,
    frontImage, backImage,
    businessName, selectedState, selectedCity,
    logoImage,
    panFile, gstFile,
    isSubmitting, setIsSubmitting,
    setSubmitError,
  } = useOnboard();

  const handleSubmit = async () => {
    if (!isFormValid) {
      onSubmitAttempt();
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Get access token from the browser Supabase client
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("Not signed in — please sign in first");
      }

      const formData = new FormData();

      // Text fields
      formData.append("name", name);
      formData.append("aadhar", aadhar.replace(/\s/g, ""));
      formData.append("businessName", businessName);
      formData.append("state", selectedState);
      formData.append("city", selectedCity);

      // File uploads
      if (frontImage) formData.append("aadharFront", frontImage);
      if (backImage) formData.append("aadharBack", backImage);
      if (panFile) formData.append("panCard", panFile);
      if (gstFile) formData.append("gstCertificate", gstFile);
      if (logoImage) formData.append("businessLogo", logoImage);

      const res = await fetch("/api/onboard/submit", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + session.access_token,
        },
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Submission failed");
      }

      // Success — navigate to submitted page
      router.push("/onboard/submitted");
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-end ml-auto gap-2">
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isFormValid || isSubmitting}
        className={`w-full md:w-[140px] font-extrabold rounded-[10px] px-4 py-[clamp(10px,1.2vw,14px)] text-[clamp(13px,1.4vw,15px)] transition-all tracking-wide transform translate-x-0 md:translate-x-[46px] ${
          isSubmitting
            ? "bg-[#6B7280] text-white cursor-wait"
            : isFormValid
              ? "bg-[#000000] text-white hover:bg-black/90 cursor-pointer"
              : "bg-[#D1D5DB] text-white cursor-not-allowed"
        }`}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}
