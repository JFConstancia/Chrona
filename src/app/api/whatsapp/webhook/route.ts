export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { twilioService } from "../../common/services/twilio.service"
import { trialService } from "../../common/services/trial.service"
import { accessGuardService } from "../../common/services/access-guard.service"
import { conversationService } from "../../common/services/conversation.service"
import { googleService } from "../../common/services/google.service"
import { normalizePhoneNumber } from "../../common/utility/phone-number.utility"

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()
    const rawPhoneNumber = String(form.get('From'))
    const body = String(form.get('Body'))
    const phoneNumber = normalizePhoneNumber(rawPhoneNumber)
  
    if(!phoneNumber) 
      return NextResponse.json({ ok: false, error: 'Phone number not found' }, { status: 400 })

    console.log("[WEBHOOK] incoming", {
      rawPhoneNumber,
      phoneNumber,
      bodyPreview: body.slice(0, 120),
    })

    let phoneTrial = await trialService.getPhoneTrialAsync(phoneNumber)
    if(!phoneTrial) phoneTrial = await trialService.startTrialAsync(phoneNumber)

    const isAllowed = await accessGuardService.isAllowedAsync(phoneNumber)
    if(!isAllowed) {
      const phoneToken = trialService.signPhoneToken(phoneNumber)
      const upgradeLink = `${process.env.PUBLIC_URL}/upgrade?token=${encodeURIComponent(phoneToken)}`
      const message = `Your free trial has concluded. Upgrade here: ${upgradeLink}`
      await twilioService.sendMessageAsync(rawPhoneNumber, message)

      return NextResponse.json({ ok: true })
    }

    const googlePhoneToken = await trialService.getGooglePhoneTokenAsync(phoneNumber)

    console.log("[WEBHOOK] googlePhoneToken lookup", {
      phoneNumber,
      found: !!googlePhoneToken,
      hasAccessToken: !!googlePhoneToken?.accessToken,
      hasRefreshToken: !!googlePhoneToken?.refreshToken,
      accessTokenLast8: googlePhoneToken?.accessToken?.slice(-8),
    })

    if(!googlePhoneToken) {
      const phoneToken = trialService.signPhoneToken(phoneNumber)
      const connectLink = `${process.env.PUBLIC_URL}/connect?token=${encodeURIComponent(phoneToken)}`
      const message = `Connect Google to start planning: ${connectLink}`
      await twilioService.sendMessageAsync(rawPhoneNumber, message)

      return NextResponse.json({ ok: true })
    }

    const { toolCall, message } = await conversationService.sendMessageForIntent(body, phoneNumber);

    if (!toolCall) {
      await twilioService.sendMessageAsync(rawPhoneNumber, message || "Sorry—I didn’t catch that.");

      return NextResponse.json({ ok: true });
    }

    const phoneTokens = { accessToken: googlePhoneToken.accessToken, refreshToken: googlePhoneToken.refreshToken }
    const googleCalendar = googleService.getGoogleCalendar(phoneTokens);
    if (toolCall.name === "schedule_event") {
      const { title } = toolCall.args || {}; // optional; we’ll take Google’s title anyway
      try {
        // Use the original user message so Google parses "tomorrow", durations, etc.
        const quickAddText = body;
    
        const { data } = await googleCalendar.events.quickAdd({
          calendarId: "primary",
          text: quickAddText,
        });
    
        // Pull what Google actually created
        const createdTitle =
          data.summary || title || "Event";
    
        const startISO =
          data.start?.dateTime ??
          (data.start?.date ? new Date(data.start.date).toISOString() : "");
    
        const endISO =
          data.end?.dateTime ??
          (data.end?.date ? new Date(data.end.date).toISOString() : "");
    
        console.log("[WEBHOOK] quickAdd created", {
          id: data.id,
          createdTitle,
          startISO,
          endISO,
        });
    
        const startFormatted = googleService.formatEU(startISO);
        const endFormatted = googleService.formatEU(endISO);
    
        await twilioService.sendMessageAsync(
          rawPhoneNumber,
          `Booked “${createdTitle}” ${startFormatted}–${endFormatted}.`
        );
      } catch (error: any) {
        console.error("[WEBHOOK] quickAdd error", error?.response?.data || error);
    
        if (googleService.isAuthError?.(error)) {
          const phoneToken = trialService.signPhoneToken(phoneNumber);
          const connectLink = `${process.env.PUBLIC_URL}/connect?token=${encodeURIComponent(phoneToken)}`;
          await twilioService.sendMessageAsync(rawPhoneNumber, `Please reconnect Google to continue: ${connectLink}`);
        } else {
          await twilioService.sendMessageAsync(
            rawPhoneNumber,
            `I couldn’t create that event. Try: Coffee tomorrow 15:00 for 30 minutes.`
          );
        }
      }
      return NextResponse.json({ ok: true });
    }
    
    // (Optional) quick MVP for list/cancel — you can fill these later:
    if (toolCall.name === "list_events") {
      await twilioService.sendMessageAsync(rawPhoneNumber, "Listing soon (MVP). Try scheduling for now.");
      return NextResponse.json({ ok: true });
    }
    
    if (toolCall.name === "cancel_event") {
      await twilioService.sendMessageAsync(rawPhoneNumber, "Canceling soon (MVP). Try scheduling for now.");
      return NextResponse.json({ ok: true });
    }
  }
  catch (error: any) {
    console.error('twilio webhook error', error)

    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}
