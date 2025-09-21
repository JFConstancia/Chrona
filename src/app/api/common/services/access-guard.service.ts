import { phoneTrialRepository } from "../repositories/phone-trial.repository"

const isAllowedAsync = async (phoneNumber: string) => {
  const phoneTrial = await phoneTrialRepository.getPhoneTrialAsync(phoneNumber)

  const allowed = 
    (phoneTrial?.status === "active") ||
    (phoneTrial?.status === "trialing" && phoneTrial.trialEndsAt && phoneTrial.trialEndsAt > new Date());

  return allowed
}

export const accessGuardService = { isAllowedAsync }