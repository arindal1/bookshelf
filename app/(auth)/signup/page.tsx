import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";

export default function SignupPage() {
  return (
    <div className="w-full max-w-sm">
      <h1 className="font-display text-4xl">Create your shelf</h1>
      <p className="mt-2 text-sm text-ink-muted">Start reading in the browser, today.</p>
      <div className="mt-8">
        <AuthForm mode="signup" />
      </div>
      <p className="font-mono-label mt-6 text-[10px] text-ink-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-accent underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}