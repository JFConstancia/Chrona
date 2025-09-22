import { conversationRepository } from "../repositories/conversation.repository";
import OpenAI from "openai";

const openAiClient = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

type ConversationResponse = { id: string, message: string }

const sendMessage = async (prompt: string, conversationId: string): Promise<ConversationResponse> => {
  const response = await openAiClient.responses.create({
    model: "gpt-4o-mini",
    input: prompt,
    temperature: 0.2,
    max_output_tokens: 100,
    previous_response_id: conversationRepository.getLastResponseId(conversationId),
  });

  // save in DB?
  conversationRepository.setLastResponseId(conversationId, response.id);
  
  const conversationResponse = { id: response.id, message: response.output_text || "No answer generated" }

  return conversationResponse;
}

export const conversationService = { sendMessage }