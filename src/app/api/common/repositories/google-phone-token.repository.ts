import { prisma } from "../../../../../prisma/client";

const upsertGooglePhoneTokenAsync = async (phoneNumber: string, accessToken: string, refreshToken: string, expiresAtMs: number, email: string) =>
  await prisma.googlePhoneToken.upsert({
    where: { phoneNumber },
    update: { accessToken, refreshToken, expiresAt: BigInt(expiresAtMs), email },
    create: { phoneNumber, accessToken, refreshToken, expiresAt: BigInt(expiresAtMs), email }
  });

const getGooglePhoneTokenAsync = async (phoneNumber: string) => 
  await prisma.googlePhoneToken.findUnique({ where: { phoneNumber } })

export const googlePhoneTokenRepository = { upsertGooglePhoneTokenAsync, getGooglePhoneTokenAsync }