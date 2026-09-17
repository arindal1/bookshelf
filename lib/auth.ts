import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { checkRateLimit } from "@/lib/rate-limit";
import { verifyCredentials } from "@/server/services/auth-service";

// Auth wired per PRD §16. Credentials provider is Prisma-backed - see
// docs/DECISIONS.md ADR-006 ("Superseded once authorize is swapped for a
// Prisma user lookup + bcrypt compare against real accounts"). Requires
// DATABASE_URL to be provisioned and migrated (ADR-002); run
// `npx prisma db seed` to create the demo account with DEMO_USER_PASSWORD.
const providers = [
  Credentials({
    name: "Email",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials, request) {
      const email = credentials?.email;
      const password = credentials?.password;
      if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
        return null;
      }

      const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
      const limit = checkRateLimit(`login:${ip}`, { max: 10, windowMs: 15 * 60 * 1000 });
      if (!limit.allowed) return null;

      return verifyCredentials(email, password);
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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as { username?: string }).username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id;
      if (token.username) session.user.username = token.username;
      return session;
    },
  },
});