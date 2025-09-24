export const SYSTEM_PROMPT = `
You are scheduling for a user in time zone Europe/Amsterdam.
Today is {YYYY-MM-DD} and the local time is {HH:mm} (Europe/Amsterdam).
Resolve relative dates like “today”, “tomorrow”, “this Friday” in Europe/Amsterdam.
`;

// Use this with openai.responses.create(...)
export const TOOLS = [
  {
    type: "function",
    name: "schedule_event",
    description: "Create a calendar event in the user's primary Google Calendar.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string" },
        start_iso: { type: "string", description: "ISO 8601 datetime, e.g. 2025-09-24T15:00:00-04:00" },
        end_iso:   { type: "string", description: "ISO 8601 datetime" },
        location:  { type: "string" },
        notes:     { type: "string" }
      },
      required: ["title", "start_iso", "end_iso"]
    }
  },
  {
    type: "function",
    name: "list_events",
    description: "List events in a time window.",
    parameters: {
      type: "object",
      properties: {
        range:   { type: "string", enum: ["today", "tomorrow", "week"] },
        from_iso:{ type: "string" },
        to_iso:  { type: "string" }
      }
    }
  },
  {
    type: "function",
    name: "cancel_event",
    description: "Cancel an event by fuzzy title match in a window.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string" },
        range: { type: "string", enum: ["today", "tomorrow", "week"] }
      },
      required: ["title"]
    }
  }
];
