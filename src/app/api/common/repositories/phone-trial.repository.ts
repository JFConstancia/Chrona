import { prisma } from "../../../../../prisma/client";

const upsertPhoneTrialAsync = async (phoneNumber: string) =>
  await prisma.phoneTrial.upsert({
    where: { phoneNumber },
    update: {},
    create: { phoneNumber, status: 'trialing', trialEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) }
  })

const getPhoneTrialAsync = async (phoneNumber: string) =>
  await prisma.phoneTrial.findUnique({ where: { phoneNumber } })

export const phoneTrialRepository = {upsertPhoneTrialAsync, getPhoneTrialAsync }
