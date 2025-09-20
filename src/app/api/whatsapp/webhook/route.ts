export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { twilioService } from "../../common/services/twilio.service"

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()
    const from = String(form.get('From'))
    const message = String(form.get('Body'))
  
    await twilioService.sendTestMessageAsync(from, message)
  
    return NextResponse.json({ ok: true })
  }
  catch (error: any) {
    console.error('twilio webhook error', error)

    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}
