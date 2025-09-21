import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "./schema";
import { prisma } from "../../../../prisma/client";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  const body = await request.json()
  const parseResult = registerSchema.safeParse(body)

  if (!parseResult.success) 
    return NextResponse.json({ error: parseResult.error.message }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email: body.email } })

  if (user) 
    return NextResponse.json({ error: "User already exists" }, { status: 400, statusText: "User already exists" })

  const hashedPassword = await bcrypt.hash(body.password, 10)
  const newUser = await prisma.user.create({ data: { email: body.email, hashedPassword } })

  return NextResponse.json({ message: "User created", email: newUser.email }, { status: 201 })
}
