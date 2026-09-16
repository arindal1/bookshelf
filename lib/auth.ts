import { timingSafeEqual } from "node:crypto";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { profile as mockProfile } from "@/lib/mock-data";

// Auth wired per PRD §16, not yet backed by Neon — see docs/DECISIONS.md
// ADR-002 and ADR-005. Credentials provider validates against the mock
// reader account so the demo login flow works without a database. Swap the
// `authorize` body for a Prisma user lookup + bcrypt compare once
// DATABASE_URL is set.
//
// SECURITY: this previously accepted ANY non-empty password for ANY email,
// which is an authentication bypass. It now requires an exact match against
// DEMO_USER_PASSWORD (see .env.example) so the demo account is still gated by
// a real credential check — see docs/DECISIONS.md ADR-006.
const DEMO_PASSWORD = process.env.DEMO_USER_PASSWORD ?? "readmore-demo";

function safeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

const providers = [
  Credentials({
    name: "Email",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials?.email;
      const password = credentials?.password;
      if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
        return null;
      }
      if (!safeEquals(password, DEMO_PASSWORD)) {
        return null;
      }
      return { id: mockProfile.id, name: mockProfile.name, email };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
});