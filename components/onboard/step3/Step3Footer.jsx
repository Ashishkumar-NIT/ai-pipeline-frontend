"use client";

import { useRouter } from "next/navigation";

export function Step3Footer() {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 pt-6 border-t border-[#E0E0E0] mt-4">
      <p className="text-[12px] text-[#9CA3AF] max-w-[340px] text-center md:text-left leading-relaxed font-medium">
        *Your documents are encrypted and only used for verification. We never share them.
      </p>
      <button 
        onClick={() => router.push('/dashboard')}
        className="w-full md:w-auto bg-[#000000] text-white font-extrabold rounded-[10px] px-10 py-[14px] hover:bg-black/90 transition-colors tracking-wide"
      >
        Submit
      </button>
    </div>
  );
}
