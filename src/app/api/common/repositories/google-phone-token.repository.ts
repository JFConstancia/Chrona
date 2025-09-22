import { prisma } from "../../../../../prisma/client";

const upsertGooglePhoneTokenAsync = async (phoneNumber: string, accessToken: string, refreshToken: string, expiresAtMs: number, email: string) =>
  await prisma.googlePhoneToken.upsert({
    where: { phoneNumber },
    update: { accessToken, refreshToken, expiresAt: expiresAtMs ? BigInt(expiresAtMs) : null, email },
    create: { phoneNumber, accessToken, refreshToken, expiresAt: expiresAtMs ? BigInt(expiresAtMs) : null, email }
  });

const getGooglePhoneTokenAsync = async (phoneNumber: string) => 
  await prisma.googlePhoneToken.findUnique({ where: { phoneNumber } })

export const googlePhoneTokenRepository = { upsertGooglePhoneTokenAsync, getGooglePhoneTokenAsync }