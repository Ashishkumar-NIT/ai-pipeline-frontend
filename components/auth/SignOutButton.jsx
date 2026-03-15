"use client";

import { signOut } from "../../lib/actions/auth";
import { Button } from "../ui/Button";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <Button type="submit" variant="outline">
        Sign Out
      </Button>
    </form>
  );
}