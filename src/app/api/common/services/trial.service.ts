import { googlePhoneTokenRepository } from "../repositories/google-phone-token.repository"
import { phoneTrialRepository } from "../repositories/phone-trial.repository"
import jwt from 'jsonwebtoken'
import 'server-only'

const startTrialAsync = async (phoneNumber: string) => 
  await phoneTrialRepository.upsertPhoneTrialAsync(phoneNumber)

const getPhoneTrialAsync = async (phoneNumber: string) => 
  await phoneTrialRepository.getPhoneTrialAsync(phoneNumber)

const saveGooglePhoneTokenAsync = async (phoneNumber: string, accessToken: string, refreshToken: string, expiresAtMs: number, email: string) => 
  await googlePhoneTokenRepository.upsertGooglePhoneTokenAsync(phoneNumber, accessToken, refreshToken, expiresAtMs, email)

const getGooglePhoneTokenAsync = async (phoneNumber: string) => 
  await googlePhoneTokenRepository.getGooglePhoneTokenAsync(phoneNumber)

const signPhoneToken = (phoneNumber: string) => 
  jwt.sign({ phoneNumber }, process.env.JWT_SECRET!, { expiresIn: '24h' })

const verifyPhoneToken = (token: string): string | null => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { phoneNumber?: string; phone?: string };
    const phoneNumber = payload.phoneNumber ?? payload.phone;

    return !phoneNumber 
      ? null 
      : phoneNumber.replace(/^whatsapp:/i, "").replace(/[()\s-]/g, "").trim();
  } catch { return null; }
}

export const trialService = { 
  startTrialAsync, 
  saveGooglePhoneTokenAsync, 
  getPhoneTrialAsync,
  getGooglePhoneTokenAsync,
  signPhoneToken,
  verifyPhoneToken
}