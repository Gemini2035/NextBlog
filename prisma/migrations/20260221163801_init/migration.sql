-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'zh',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "published" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[],
    "originalSlug" TEXT,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "posts_locale_published_idx" ON "posts"("locale", "published");

-- CreateIndex
CREATE INDEX "posts_date_idx" ON "posts"("date" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "posts_slug_locale_key" ON "posts"("slug", "locale");
