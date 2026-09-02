create extension if not exists vector;

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text not null,
  tags text[] not null default '{}',
  price_cents integer,
  -- Dimension must match the embeddings model's output_dimension
  -- (voyage-3.5-lite default: 1024 — see lib/embeddings.ts EMBEDDING_DIMENSION).
  embedding vector(1024),
  created_at timestamptz not null default now()
);

create index on products using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create or replace function match_products(
  query_embedding vector(1024),
  match_count int default 5
)
returns table (
  id uuid,
  name text,
  category text,
  description text,
  price_cents integer,
  similarity float
)
language sql stable
as $$
  select
    products.id,
    products.name,
    products.category,
    products.description,
    products.price_cents,
    1 - (products.embedding <=> query_embedding) as similarity
  from products
  order by products.embedding <=> query_embedding
  limit match_count;
$$;
