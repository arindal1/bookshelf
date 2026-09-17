"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  EmailAlreadyRegisteredError,
  UsernameAlreadyTakenError,
  registerUser,
} from "@/server/services/auth-service";

const signupSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(24, "Username must be at most 24 characters.")
    .regex(/^[a-zA-Z0-9_.]+$/, "Username can only contain letters, numbers, dots and underscores."),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters.").max(72),
});

type SignupResult = { ok: true } | { ok: false; error: string };

export async function registerAccount(input: {
  username: string;
  email: string;
  password: string;
}): Promise<SignupResult> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = checkRateLimit(`signup:${ip}`, { max: 5, windowMs: 15 * 60 * 1000 });
  if (!limit.allowed) {
    return { ok: false, error: "Too many attempts. Try again in a few minutes." };
  }

  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    await registerUser(parsed.data);
    return { ok: true };
  } catch (err) {
    if (err instanceof EmailAlreadyRegisteredError) {
      return { ok: false, error: "That email is already registered." };
    }
    if (err instanceof UsernameAlreadyTakenError) {
      return { ok: false, error: "That username is already taken." };
    }
    return { ok: false, error: "Could not create account. Try again." };
  }
}