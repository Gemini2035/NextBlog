-- 为 posts 表添加全文检索：search_vector 由 title / description / content->>'raw' 组成，使用 'simple' 配置（不词干，适合中英混合）
ALTER TABLE "posts"
ADD COLUMN IF NOT EXISTS "search_vector" tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('simple', coalesce("title", '')), 'A')
  || setweight(to_tsvector('simple', coalesce("description", '')), 'B')
  || setweight(to_tsvector('simple', coalesce("content"->>'raw', '')), 'C')
) STORED;

CREATE INDEX IF NOT EXISTS "posts_search_vector_idx" ON "posts" USING GIN ("search_vector");
