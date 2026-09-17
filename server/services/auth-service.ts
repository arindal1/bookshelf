import bcrypt from "bcryptjs";
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
} from "@/server/repositories/user-repository";

// Real (Prisma-backed) auth service - supersedes the ADR-006 demo-password
// bypass now that a live user store is in place. See docs/DECISIONS.md.
const BCRYPT_SALT_ROUNDS = 12;

export class EmailAlreadyRegisteredError extends Error {
  constructor() {
    super("Email already registered");
    this.name = "EmailAlreadyRegisteredError";
  }
}

export class UsernameAlreadyTakenError extends Error {
  constructor() {
    super("Username already taken");
    this.name = "UsernameAlreadyTakenError";
  }
}

export async function registerUser(input: {
  username: string;
  email: string;
  password: string;
}): Promise<{ id: string; email: string; username: string }> {
  const [existingEmail, existingUsername] = await Promise.all([
    findUserByEmail(input.email),
    findUserByUsername(input.username),
  ]);
  if (existingEmail) throw new EmailAlreadyRegisteredError();
  if (existingUsername) throw new UsernameAlreadyTakenError();

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_SALT_ROUNDS);
  const user = await createUser({
    username: input.username,
    email: input.email,
    name: input.username,
    passwordHash,
  });

  return { id: user.id, email: user.email, username: user.username };
}

export async function verifyCredentials(
  email: string,
  password: string
): Promise<{ id: string; name: string; email: string; username: string } | null> {
  const user = await findUserByEmail(email);
  if (!user?.passwordHash) return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  return { id: user.id, name: user.name ?? user.username, email: user.email, username: user.username };
}