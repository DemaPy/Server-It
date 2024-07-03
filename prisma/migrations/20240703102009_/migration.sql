/*
  Warnings:

  - You are about to drop the column `position` on the `ComponentPlaceholder` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `SectionPlaceholder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ComponentPlaceholder" DROP COLUMN "position";

-- AlterTable
ALTER TABLE "SectionPlaceholder" DROP COLUMN "position";
