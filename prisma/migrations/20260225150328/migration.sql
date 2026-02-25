/*
  Warnings:

  - You are about to drop the column `originalSlug` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `search_vector` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `posts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `posts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "posts_search_vector_idx";

-- DropIndex
DROP INDEX "posts_slug_locale_key";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "originalSlug",
DROP COLUMN "search_vector",
DROP COLUMN "slug",
DROP COLUMN "tags";

-- CreateTable
CREATE TABLE "post_tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "post_tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "post_tags_postId_idx" ON "post_tags"("postId");

-- CreateIndex
CREATE INDEX "post_tags_name_idx" ON "post_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "post_tags_postId_name_key" ON "post_tags"("postId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "posts_id_key" ON "posts"("id");

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
