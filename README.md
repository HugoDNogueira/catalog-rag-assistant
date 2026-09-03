# Catalog RAG Assistant

A small Retrieval-Augmented Generation (RAG) assistant that answers natural-language
questions about a retail product catalog, grounded only in the catalog itself.

## Status

Work in progress, not yet deployed. Uses a small set of **synthetic** hardware-store
products (`data/products.sample.json`), not real client data.

Retrieval pipeline (embeddings + pgvector search) verified working end-to-end
against a live database. Generation step (Claude API) is integrated but not yet
verified end-to-end — pending API credit.

## Architecture

```
Product catalog (JSON)
      │
      ▼
scripts/ingest.ts ──► Voyage AI embeddings ──► Supabase (Postgres + pgvector)
                                                        ▲
                                                        │ match_products() — cosine similarity
User question ──► embed question ──────────────────────┘
      │
      └──► prompt with retrieved products ──► Claude API ──► grounded answer
```

## Stack

- Next.js 16 (App Router) + TypeScript
- Supabase / PostgreSQL with `pgvector`
- Voyage AI (`voyage-3.5-lite`) for embeddings
- Anthropic Claude API for grounded answer generation
- Vitest for unit tests

## Setup

1. `npm install`
2. Create a Supabase project, enable the `vector` extension, and run `supabase/migrations/0001_init.sql`
3. Copy `.env.example` to `.env.local` and fill in the keys
4. `npm run ingest` to embed and load the sample catalog
5. `npm run dev`

## Roadmap

- [ ] Expand `data/products.sample.json` into a larger synthetic catalog (200-500 products)
- [ ] Deploy to Vercel
- [ ] Add a tool-calling step (e.g. price-range filtering) to genuinely justify "agentic" in the CV
- [ ] Eval script: a fixed set of test questions with expected top-k products (retrieval quality)
- [ ] Structured outputs for the Claude response (e.g. typed product recommendations, not just free text)
- [ ] Basic observability: log latency and token usage per request
