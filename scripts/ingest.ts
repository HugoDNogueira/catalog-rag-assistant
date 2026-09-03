import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { embed } from "../lib/embeddings";

type SourceProduct = {
  name: string;
  category: string;
  description: string;
  tags: string[];
  price_cents: number | null;
};

const BATCH_SIZE = 20;

async function main() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables");
  }

  const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } });

  const raw = readFileSync(join(process.cwd(), "data/products.sample.json"), "utf-8");
  const products: SourceProduct[] = JSON.parse(raw);

  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    const embeddings = await embed(batch.map((p) => `${p.name}. ${p.description}`));

    const rows = batch.map((p, idx) => ({ ...p, embedding: embeddings[idx] }));
    const { error } = await supabase.from("products").insert(rows);

    if (error) {
      throw new Error(`Insert failed at batch ${i}: ${error.message}`);
    }

    console.log(`Ingested ${i + batch.length}/${products.length}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
