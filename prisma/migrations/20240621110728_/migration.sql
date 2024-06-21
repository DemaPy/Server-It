/*
  Warnings:

  - You are about to drop the column `css` on the `Campaign` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Component` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'GUEST';

-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "css";

-- AlterTable
ALTER TABLE "Component" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
