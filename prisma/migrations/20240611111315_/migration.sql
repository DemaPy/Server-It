/*
  Warnings:

  - You are about to drop the `Placeholder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Placeholder" DROP CONSTRAINT "Placeholder_componentId_fkey";

-- DropForeignKey
ALTER TABLE "Placeholder" DROP CONSTRAINT "Placeholder_sectionId_fkey";

-- DropTable
DROP TABLE "Placeholder";

-- CreateTable
CREATE TABLE "ComponentPlaceholder" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "fallback" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,

    CONSTRAINT "ComponentPlaceholder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionPlaceholder" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "fallback" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,

    CONSTRAINT "SectionPlaceholder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ComponentPlaceholder_id_idx" ON "ComponentPlaceholder"("id");

-- CreateIndex
CREATE INDEX "ComponentPlaceholder_componentId_idx" ON "ComponentPlaceholder"("componentId");

-- CreateIndex
CREATE INDEX "SectionPlaceholder_id_idx" ON "SectionPlaceholder"("id");

-- CreateIndex
CREATE INDEX "SectionPlaceholder_sectionId_idx" ON "SectionPlaceholder"("sectionId");

-- CreateIndex
CREATE INDEX "Campaign_userId_idx" ON "Campaign"("userId");

-- AddForeignKey
ALTER TABLE "ComponentPlaceholder" ADD CONSTRAINT "ComponentPlaceholder_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionPlaceholder" ADD CONSTRAINT "SectionPlaceholder_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;
