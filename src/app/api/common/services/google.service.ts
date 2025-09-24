import { google } from "googleapis"

export type PhoneTokens = { accessToken: string; refreshToken?: string | null }

const timeZone = "Europe/Amsterdam"

const getGoogleCalendar = (tokens: PhoneTokens) => {
  const oauthClient = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )

  oauthClient.setCredentials({
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken ?? undefined
  })

  return google.calendar({ version: "v3", auth: oauthClient })
}

const createGoogleCalendarEvent = async (
  tokens: PhoneTokens,
  title: string,
  startISO: string,
  endISO: string,
  location?: string,
  notes?: string
) => {
  const googleCalendar = getGoogleCalendar(tokens)

  const { data } = await googleCalendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: title,
      description: notes,
      location,
      start: { dateTime: startISO, timeZone },
      end: { dateTime: endISO, timeZone }
    }
  })

  const googleCalendarEvent = { id: data.id!, title, startISO, endISO }

  return googleCalendarEvent
}

const listGoogleCalendarEvent = async (
  tokens: PhoneTokens,
  fromISO: string,
  toISO: string
) => {
  const googleCalendar = getGoogleCalendar(tokens)

  const { data } = await googleCalendar.events.list({
    calendarId: "primary",
    timeMin: fromISO,
    timeMax: toISO,
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 50
  })

  const googleCalendarEvents = (data.items ?? []).map((event) => ({
    id: event.id!,
    title: event.summary ?? "(untitled)",
    startISO: event.start?.dateTime ?? (event.start?.date ? new Date(event.start.date).toISOString() : ""),
    endISO: event.end?.dateTime ?? (event.end?.date ? new Date(event.end.date).toISOString() : "")
  }))

  return googleCalendarEvents
}

const deleteGoogleCalendarEvent = async (tokens: PhoneTokens, id: string) => {
  const googleCalendar = getGoogleCalendar(tokens)

  await googleCalendar.events.delete({ calendarId: "primary", eventId: id })
}

// Helpers for ranges & formatting (CEST)
const timePeriodToISO = (timePeriod: "today" | "tomorrow" | "week") => {
  const startDate = new Date()
  const endDate = new Date()

  if (timePeriod === "tomorrow") {
    startDate.setDate(startDate.getDate() + 1)
    startDate.setHours(0, 0, 0, 0)

    endDate.setTime(startDate.getTime())
    endDate.setHours(23, 59, 59, 999)
  } else if (timePeriod === "week") {
    startDate.setHours(0, 0, 0, 0)

    endDate.setDate(endDate.getDate() + 7)
    endDate.setHours(23, 59, 59, 999)
  } else {
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(23, 59, 59, 999)
  }

  const timePeriodISO = { fromISO: startDate.toISOString(), toISO: endDate.toISOString() }

  return timePeriodISO
}

const formatEU = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    timeZone,
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  })

/** Treat only real auth problems as "reconnect" */
const isAuthError = (error: any) => {
  const message = String(error?.message || "");
  return (
    error?.code === 401 ||
    /invalid_grant|invalid_credentials|unauthorized|login required|Request had invalid authentication credentials/i.test(
      message
    )
  );
};

/** Interpret a (possibly offset-suffixed) ISO as local calendar time in Europe/Amsterdam */
const toCalendarLocal = (isoString: string) => {
  const dateTimeLocal = String(isoString || "").replace(/([+-]\d{2}:\d{2}|Z)$/i, "");
  
  return { dateTime: dateTimeLocal, timeZone };
};

export const googleService = {
  getGoogleCalendar,
  createGoogleCalendarEvent,
  listGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
  timePeriodToISO,
  formatEU,
  toCalendarLocal,
  isAuthError
}