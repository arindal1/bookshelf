"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { registerAccount } from "@/lib/actions/auth";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <form
      className="w-full max-w-sm space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setError(null);
        const form = new FormData(e.currentTarget);
        const email = String(form.get("email") ?? "");
        const password = String(form.get("password") ?? "");

        if (mode === "signup") {
          const username = String(form.get("username") ?? "");
          const result = await registerAccount({ username, email, password });
          if (!result.ok) {
            setPending(false);
            setError(result.error);
            return;
          }
        }

        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        setPending(false);
        if (result?.error) {
          setError(
            mode === "signup"
              ? "Account created, but sign-in failed. Try logging in."
              : "Could not sign in. Check your details and try again."
          );
          return;
        }
        router.push("/dashboard");
        router.refresh();
      }}
    >
      {mode === "signup" && (
        <Field label="Username" name="username" type="text" placeholder="m.arlen" />
      )}
      <Field label="Email" name="email" type="email" placeholder="you@example.com" />
      <Field label="Password" name="password" type="password" placeholder="••••••••" />

      {error && <p className="font-mono-label text-[10px] text-danger">{error}</p>}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Working…" : mode === "login" ? "Sign in" : "Create account"}
      </Button>

      <div className="flex items-center gap-3 py-2">
        <div className="h-px flex-1 bg-line" />
        <span className="font-mono-label text-[10px] text-ink-muted">OR</span>
        <div className="h-px flex-1 bg-line" />
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
        >
          Continue with GitHub
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  placeholder,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="font-mono-label text-[10px] text-ink-muted">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required
        className={cn(
          "w-full border-2 border-line bg-transparent px-3 py-2.5 text-sm text-ink outline-none",
          "focus:border-accent"
        )}
      />
    </label>
  );
}