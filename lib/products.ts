import { getSupabaseAdmin } from "./supabase";

export type MatchedProduct = {
  id: string;
  name: string;
  category: string;
  description: string;
  price_cents: number | null;
  similarity: number;
};

export async function matchProducts(queryEmbedding: number[], matchCount = 5): Promise<MatchedProduct[]> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase.rpc("match_products", {
    query_embedding: queryEmbedding,
    match_count: matchCount,
  });

  if (error) {
    throw new Error(`match_products RPC failed: ${error.message}`);
  }

  return data as MatchedProduct[];
}
