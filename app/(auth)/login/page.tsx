import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <h1 className="font-display text-4xl">Sign in</h1>
      <p className="mt-2 text-sm text-ink-muted">Continue reading where you stopped.</p>
      <p className="font-mono-label mt-2 text-[10px] text-ink-muted">
        Demo: m.arlen@example.com, password <code>readmore-demo</code> (after seeding)
      </p>
      <div className="mt-8">
        <AuthForm mode="login" />
      </div>
      <p className="font-mono-label mt-6 text-[10px] text-ink-muted">
        No account?{" "}
        <Link href="/signup" className="text-accent underline underline-offset-4">
          Create one
        </Link>
      </p>
    </div>
  );
}