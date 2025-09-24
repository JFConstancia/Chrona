export const normalizePhoneNumber = (rawPhoneNumber: string | null | undefined): string => {
  if (!rawPhoneNumber) return ""

  let phoneNumber = String(rawPhoneNumber).trim()

  if (phoneNumber.toLowerCase().startsWith("whatsapp:")) 
    phoneNumber = phoneNumber.slice("whatsapp:".length)
  
  phoneNumber = phoneNumber.replace(/[()\s-]+/g, "")

  if (!phoneNumber.startsWith("+") && /^\d+$/.test(phoneNumber)) 
    phoneNumber = "+" + phoneNumber
  
  return phoneNumber
}