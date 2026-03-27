"use client";

import Link from "next/link";
import { signOut } from "../../lib/actions/auth";

export function OnboardNavbar({ backRoute = "/signin" }) {
  return (
    <nav className="w-full bg-white border-b border-[#E0E0E0] px-6 py-4 flex items-center justify-between">
      <Link href={backRoute} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-full transition-colors text-sm font-medium text-gray-700">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back
      </Link>
      <button onClick={() => signOut()} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-full transition-colors text-sm font-medium text-gray-700">
        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
           <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        </div>
        Sign out
      </button>
    </nav>
  );
}
