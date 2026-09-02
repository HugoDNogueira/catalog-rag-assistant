"use client";

import { useState } from "react";

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  similarity: number;
};

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAsk() {
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();
      setAnswer(data.answer);
      setProducts(data.products ?? []);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold mb-4">Catalog Assistant</h1>
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 border rounded px-3 py-2"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder="e.g. I need a rust-resistant outdoor wood screw"
        />
        <button
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handleAsk}
          disabled={loading}
        >
          {loading ? "..." : "Ask"}
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {answer && <div className="mb-6 whitespace-pre-wrap rounded border p-4">{answer}</div>}

      {products.length > 0 && (
        <ul className="space-y-2">
          {products.map((p) => (
            <li key={p.id} className="rounded border p-3 text-sm">
              <span className="font-semibold">{p.name}</span> — {p.category}
              <div className="text-gray-500">{p.description}</div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
