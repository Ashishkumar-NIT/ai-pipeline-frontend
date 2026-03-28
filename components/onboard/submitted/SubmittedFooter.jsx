"use client";
import { useRouter } from "next/navigation";

export function SubmittedFooter() {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 pt-6 mt-8">
      <div className="text-[13px] text-center md:text-left flex flex-col gap-1">
        <span className="text-[#9CA3AF]">Need help in the meantime? Call us on</span>
        <div>
          <span className="font-bold text-[#111827]">9897453396</span>
          <span className="text-[#9CA3AF]"> — we&apos;re happy to assist.</span>
        </div>
      </div>
      <button 
        onClick={() => router.push('/dashboard')}
        className={`w-full md:w-auto bg-[#000000] text-white font-extrabold rounded-[10px] px-[clamp(24px,3vw,40px)] py-[clamp(10px,1.2vw,14px)] text-[clamp(13px,1.4vw,15px)] hover:bg-black/90 transition-colors tracking-wide`}
      >
        I understand
      </button>
    </div>
  );
}
