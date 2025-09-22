export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { twilioService } from "../../common/services/twilio.service"
import { trialService } from "../../common/services/trial.service"
import { accessGuardService } from "../../common/services/access-guard.service"
import { conversationService } from "../../common/services/conversation.service"

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()
    const from = String(form.get('From'))
    const body = String(form.get('Body'))
    const phoneNumber = from.replace('whatsapp:', '')
  
    if(!phoneNumber) 
      return NextResponse.json({ ok: false, error: 'Phone number not found' }, { status: 400 })

    let phoneTrial = await trialService.getPhoneTrialAsync(phoneNumber)
    if(!phoneTrial) phoneTrial = await trialService.startTrialAsync(phoneNumber)

    const isAllowed = await accessGuardService.isAllowedAsync(phoneNumber)
    if(!isAllowed) {
      const phoneToken = trialService.signPhoneToken(phoneNumber)
      const upgradeLink = `${process.env.PUBLIC_URL}/upgrade?token=${encodeURIComponent(phoneToken)}`
      const message = `Your free trial has concluded. Upgrade here: ${upgradeLink}`
      await twilioService.sendMessageAsync(from, message)

      return NextResponse.json({ ok: true })
    }

    const googlePhoneToken = await trialService.getGooglePhoneTokenAsync(phoneNumber)
    if(!googlePhoneToken) {
      const phoneToken = trialService.signPhoneToken(phoneNumber)
      const connectLink = `${process.env.PUBLIC_URL}/connect?token=${encodeURIComponent(phoneToken)}`
      const message = `Connect Google to start planning: ${connectLink}`
      await twilioService.sendMessageAsync(from, message)

      return NextResponse.json({ ok: true })
    }

    const openAiResponse = await conversationService.sendMessage(body, phoneNumber)
    await twilioService.sendMessageAsync(from, openAiResponse.message)
    
    // TODO: vervang onderstaande echo met jouw create/list/cancel flow

    return NextResponse.json({ ok: true })
  }
  catch (error: any) {
    console.error('twilio webhook error', error)

    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}
