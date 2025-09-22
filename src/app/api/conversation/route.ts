import { NextRequest, NextResponse } from "next/server";
import { conversationSchema } from "./schema";
import { conversationService } from "../common/services/conversation.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = conversationSchema.safeParse(body);

    if(!parseResult.success) 
      return NextResponse.json({ error: parseResult.error.format() }, { status: 400 })
    
    const { prompt, conversationId } = body;
    const response = await conversationService.sendMessage(prompt, conversationId);
    const answer = response.message

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("OpenAI API error:", error);

    return NextResponse.json(
      { error: "Failed to generate answer" },
      { status: 500 }
    );
  }
}
