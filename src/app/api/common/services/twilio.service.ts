// @ts-ignore
import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = twilio(accountSid, authToken)

const sendTestMessage = async (from: string, message: string) => {
  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM!,
    to: from,
    body: `Je zei: "${message}". Ik ben online ✅`
  })
}

export const twilioService = { sendTestMessageAsync: sendTestMessage }