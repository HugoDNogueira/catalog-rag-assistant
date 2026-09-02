import { z } from "zod";

export const askRequestSchema = z.object({
  question: z.string().min(1).max(500),
});
