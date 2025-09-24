import OpenAI from "openai";
import { SYSTEM_PROMPT, TOOLS as RAW_TOOLS } from "@/app/common/prompts/prompt";
import { conversationRepository } from "../repositories/conversation.repository";
import { ToolCall, toolService } from "./tool.service";

const openAiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

type ConversationResponse = { id: string; message: string };

const sendMessage = async (prompt: string, conversationId: string): Promise<ConversationResponse> => {
  const canonicalizedTools = toolService.canonicalizeTools(RAW_TOOLS);

  const response = await openAiClient.responses.create({
    model: "gpt-4o-mini",
    input: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
    tools: canonicalizedTools,
    tool_choice: "auto",
    previous_response_id: conversationRepository.getLastResponseId(conversationId),
  })

  conversationRepository.setLastResponseId(conversationId, response.id);

  // NOTE: If the model decided to call a tool, output_text may be empty.
  // For now we return a fallback string; you can detect tool calls later if needed.
  const message = response.output_text?.trim() || "No answer generated";

  return { id: response.id, message };
}

const sendMessageForIntent = async (prompt: string, conversationId: string): Promise<{ toolCall?: ToolCall; message?: string }> => {
  const tools = toolService.canonicalizeTools(RAW_TOOLS)

  const openAiResponse = await openAiClient.responses.create({
    model: "gpt-4o-mini",
    input: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
    tools,
    tool_choice: "required", // force a tool call for MVP
    previous_response_id: conversationRepository.getLastResponseId(conversationId),
  })

  conversationRepository.setLastResponseId(conversationId, openAiResponse.id)

  const items = (openAiResponse.output ?? []) as any[]

  const toolCall = items
    .map(toolService.extractToolCall)
    .find(Boolean) as ToolCall | undefined;

  return toolCall 
  ? { toolCall: toolCall }
  : { message: openAiResponse.output_text?.trim() || "Sorry—I didn’t catch that. Could you rephrase?" }
}

export const conversationService = { sendMessage, sendMessageForIntent };
