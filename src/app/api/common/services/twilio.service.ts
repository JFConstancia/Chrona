// @ts-ignore
import twilio from 'twilio'
import 'server-only'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = twilio(accountSid, authToken)

const sendMessageAsync = async (from: string, message: string) => {
  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM!,
    to: from,
    body: message
  })
}

export const twilioService = { sendMessageAsync }