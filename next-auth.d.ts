// types/next-auth.d.ts  (or anywhere in src and included in tsconfig)
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  interface JWT {
    id?: string;
  }
}
