import { NextAuthOptions, getServerSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../prisma/client";
import bcrypt from "bcrypt";

const googleProvider = GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  authorization: {
    params: {
      scope: "openid email profile https://www.googleapis.com/auth/calendar.events",
      access_type: "offline",   // <- needed for refresh_token
      prompt: "consent",        // <- force new refresh_token even if previously granted
      include_granted_scopes: "false",
      response_type: "code"
    }
  }
})

const credentialsProvider = CredentialsProvider({
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "email", placeholder: "Email" },
    password: { label: "Password", type: "password" }
  },
  async authorize(credentials, request) {
    if(!credentials?.email || !credentials?.password) return null

    const user = await prisma.user.findUnique({ where: { email: credentials.email } })
    if(!user) return null

    const passwordsMatch = await bcrypt.compare(credentials.password, user.hashedPassword!)
    return passwordsMatch ? user : null
  }
})

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET!,
  session: { strategy: "jwt" },
  providers: [googleProvider, credentialsProvider],
  adapter: PrismaAdapter(prisma),

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "google") {
        token.g_access_token = account.access_token;
        token.g_refresh_token = account.refresh_token ?? token.g_refresh_token;
        token.g_expires_at = Date.now() + Number(account?.expires_in ?? 0) * 1000;
        token.g_email = (profile as any)?.email;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).google = {
        access_token: token.g_access_token,
        refresh_token: token.g_refresh_token,
        expires_at: token.g_expires_at as number,
        email: token.g_email,
      };
      return session;
    }
  }
}

export function auth() { return getServerSession(authOptions) }