import { LogOut } from "lucide-react";
import { signOut } from "@/app/auth/actions";

export default function LogoutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="flex w-full items-center gap-2 border border-line px-2.5 py-2 text-xs text-muted transition-colors hover:border-rose/40 hover:text-rose"
      >
        <LogOut size={13} /> вийти
      </button>
    </form>
  );
}
