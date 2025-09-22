import z from "zod";

export const conversationSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, "Prompt is required")
    .max(1000, "Prompt must be less than 1000 characters"),
  conversationId: z
    .string()
    .uuid()
    .optional()
});