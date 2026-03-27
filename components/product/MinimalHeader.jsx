"use client";

import { SignOutButton } from "../auth/SignOutButton";

export function MinimalHeader({ userEmail }) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-end bg-transparent px-6 py-4">
      <div className="flex items-center gap-4 md:gap-6">
        {userEmail && (
          <span className="text-[14px] text-[#555555] font-normal leading-none font-sans hidden sm:inline-block">
            {userEmail}
          </span>
        )}
        <SignOutButton />
      </div>
    </header>
  );
}
