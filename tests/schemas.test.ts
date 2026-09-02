import { describe, expect, it } from "vitest";
import { askRequestSchema } from "../lib/schemas";

describe("askRequestSchema", () => {
  it("accepts a valid question", () => {
    const result = askRequestSchema.safeParse({ question: "Do you have exterior screws?" });
    expect(result.success).toBe(true);
  });

  it("rejects an empty question", () => {
    const result = askRequestSchema.safeParse({ question: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a question over 500 characters", () => {
    const result = askRequestSchema.safeParse({ question: "a".repeat(501) });
    expect(result.success).toBe(false);
  });
});
