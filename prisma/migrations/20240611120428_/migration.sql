/*
  Warnings:

  - Made the column `userId` on table `Campaign` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Template` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Campaign" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Template" ALTER COLUMN "userId" SET NOT NULL;
