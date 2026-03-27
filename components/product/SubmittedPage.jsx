"use client";

import { useRouter } from "next/navigation";

export function SubmittedPage() {
  const router = useRouter();

  return (
    <main className="flex-1 w-full flex flex-col items-center justify-center p-4 min-h-screen">
      <div className="max-w-[480px] w-full flex flex-col items-center text-center -mt-16">
        <h1 
          className="text-[40px] md:text-[44px] text-[#000000] font-normal mb-4" 
          style={{ fontFamily: "Georgia, 'Playfair Display', serif" }}
        >
          Submitted
        </h1>
        <p className="text-[15px] md:text-[16px] text-[#666666] font-normal leading-[1.6] mb-8 font-sans">
          Your design is in good hands We&apos;ve received your photo and details. Our AI is getting to work — you&apos;ll see your studio-ready images within 24 hours.
        </p>
        <button
          onClick={() => router.push("/dashboard/wholesaler")}
          className="bg-[#0A0A0A] text-[#FFFFFF] rounded-[10px] md:rounded-[12px] px-8 py-[14px] text-[15px] font-medium hover:bg-black hover:shadow-[0_0_15px_rgba(255,215,0,0.1)] transition-all flex items-center justify-center cursor-pointer font-sans"
        >
          Back to dashboard
        </button>
      </div>
    </main>
  );
}
