import { NextRequest, NextResponse } from "next/server";
import { askRequestSchema } from "@/lib/schemas";
import { getAnthropicClient } from "@/lib/anthropic";
import { embed } from "@/lib/embeddings";
import { matchProducts } from "@/lib/products";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = askRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { question } = parsed.data;

  const [queryEmbedding] = await embed([question]);
  const products = await matchProducts(queryEmbedding, 5);

  const context = products
    .map((p) => `- ${p.name} (${p.category}): ${p.description}`)
    .join("\n");

  const completion = await getAnthropicClient().messages.create({
    model: "claude-sonnet-5",
    max_tokens: 500,
    system:
      "You are a product assistant for a hardware retail catalog. Only recommend products from the " +
      "CONTEXT below. If none of the products fit the question, say so clearly instead of guessing.",
    messages: [{ role: "user", content: `CONTEXT:\n${context}\n\nQUESTION: ${question}` }],
  });

  const answer = completion.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  return NextResponse.json({ answer, products });
}
