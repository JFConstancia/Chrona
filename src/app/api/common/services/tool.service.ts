export type ToolCall = { name: 'schedule_event' | 'list_events' | 'cancel_event', args: any }

const canonicalizeTools = (input: ReadonlyArray<any>): any[] => {
  if (!Array.isArray(input) || input.length === 0) 
    throw new Error("TOOLS is missing or empty");

  const canonicalizedTools = input.map((tool, i) => {
    if (tool?.type === "function" && tool?.name) 
      return tool

    if (tool?.type === "function" && tool?.function?.name) 
      return {
        type: "function",
        name: tool.function.name,
        description: tool.function.description ?? "",
        parameters: tool.function.parameters ?? { type: "object", properties: {} },
      }
    
    if (tool?.name && tool?.parameters) 
      return { type: "function", name: tool.name, description: tool.description ?? "", parameters: tool.parameters }
    
    throw new Error(`Invalid tool definition at index ${i}`)
  })

  return canonicalizedTools;
}

const extractToolCall = (item: any): ToolCall | null => {
  if (!item) return null

  // Most SDKs return one of these shapes:
  if (item.type === "function_call") {
    const name = item.name as ToolCall["name"]

    let args: any = item.arguments ?? {}
    
    if (typeof args === "string") { try { args = JSON.parse(args); } catch {/* ignore */} }
    
    return name 
      ? { name, args } 
      : null
  }

  if (item.type === "tool_call") {
    const name = item.name as ToolCall["name"]
    const args = item.arguments ?? {}

    return name ? { name, args } : null
  }
  
  if (item.type === "tool_use") {
    const name = item.name as ToolCall["name"]
    const args = item.input ?? {}

    return name ? { name, args } : null
  }
  
  return null
}

export const toolService = { canonicalizeTools, extractToolCall }