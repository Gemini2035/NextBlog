/*
  Warnings:

  - You are about to drop the column `postId` on the `post_tags` table. All the data in the column will be lost.
  - You are about to drop the column `locale` on the `posts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[localeCode,name]` on the table `post_tags` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,localeCode]` on the table `posts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `localeCode` to the `post_tags` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `post_tags` table without a default value. This is not possible if the table is not empty.
  - Added the required column `localeCode` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "post_tags" DROP CONSTRAINT "post_tags_postId_fkey";

-- DropIndex
DROP INDEX "post_tags_postId_idx";

-- DropIndex
DROP INDEX "post_tags_postId_name_key";

-- DropIndex
DROP INDEX "posts_id_key";

-- DropIndex
DROP INDEX "posts_locale_published_idx";

-- AlterTable
ALTER TABLE "post_tags" DROP COLUMN "postId",
ADD COLUMN     "bgColor" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "localeCode" TEXT NOT NULL,
ADD COLUMN     "textColor" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "locale",
ADD COLUMN     "localeCode" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "locales" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "locales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PostToPostTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PostToPostTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "locales_code_idx" ON "locales"("code");

-- CreateIndex
CREATE INDEX "locales_isDefault_code_idx" ON "locales"("isDefault", "code");

-- CreateIndex
CREATE UNIQUE INDEX "locales_code_key" ON "locales"("code");

-- CreateIndex
CREATE INDEX "_PostToPostTag_B_index" ON "_PostToPostTag"("B");

-- CreateIndex
CREATE INDEX "post_tags_localeCode_name_idx" ON "post_tags"("localeCode", "name");

-- CreateIndex
CREATE UNIQUE INDEX "post_tags_localeCode_name_key" ON "post_tags"("localeCode", "name");

-- CreateIndex
CREATE INDEX "posts_localeCode_published_idx" ON "posts"("localeCode", "published");

-- CreateIndex
CREATE UNIQUE INDEX "posts_id_localeCode_key" ON "posts"("id", "localeCode");

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_localeCode_fkey" FOREIGN KEY ("localeCode") REFERENCES "locales"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_localeCode_fkey" FOREIGN KEY ("localeCode") REFERENCES "locales"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToPostTag" ADD CONSTRAINT "_PostToPostTag_A_fkey" FOREIGN KEY ("A") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToPostTag" ADD CONSTRAINT "_PostToPostTag_B_fkey" FOREIGN KEY ("B") REFERENCES "post_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
