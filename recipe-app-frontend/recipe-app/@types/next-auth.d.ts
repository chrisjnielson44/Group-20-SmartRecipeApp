import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      userid: string | null | undefined;
    } & DefaultSession["user"];
  }
}
