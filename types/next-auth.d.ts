import type { DefaultSession } from "next-auth";

// Augments the default NextAuth session/JWT shape with the fields our
// Credentials `authorize`/`verifyCredentials` flow returns (id, username),
// so server components can identify "is this the signed-in user's own
// profile?" without a second DB lookup keyed only on name/email.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string;
  }
}