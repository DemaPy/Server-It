/*
  Warnings:

  - Added the required column `componentId` to the `Placeholder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Placeholder" ADD COLUMN     "componentId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Component" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Component_id_idx" ON "Component"("id");

-- CreateIndex
CREATE INDEX "Placeholder_componentId_idx" ON "Placeholder"("componentId");

-- AddForeignKey
ALTER TABLE "Placeholder" ADD CONSTRAINT "Placeholder_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;
