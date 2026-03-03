/*
  Warnings:

  - You are about to drop the column `bgColor` on the `post_tags` table. All the data in the column will be lost.
  - You are about to drop the column `textColor` on the `post_tags` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "post_tags" DROP COLUMN "bgColor",
DROP COLUMN "textColor";
