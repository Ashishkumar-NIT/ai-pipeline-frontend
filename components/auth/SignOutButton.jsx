"use client";

import { signOut } from "../../lib/actions/auth";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="bg-[#0A0A0A] text-white px-6 py-3 rounded-xl text-[15px] font-medium cursor-pointer hover:bg-black/90 transition-colors font-sans"
      >
        Sign out
      </button>
    </form>
  );
}
