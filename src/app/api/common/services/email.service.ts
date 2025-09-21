import 'server-only'
import { ReactElement } from "react"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const sendEmailAsync = async (to: string, subject: string, template: ReactElement) => 
  await resend.emails.send({
    from: "no-reply@chrona-assistant.com",
    to,
    subject,
    react: template,
  })

export const emailService = { sendEmailAsync }