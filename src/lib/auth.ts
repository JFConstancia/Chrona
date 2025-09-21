import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../prisma/client";
import bcrypt from "bcrypt";

const googleProvider = GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!
})

const credentialsProvider = CredentialsProvider({
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "email", placeholder: "Email" },
    password: { label: "Password", type: "password" }
  },
  async authorize(credentials, req) {
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
}
