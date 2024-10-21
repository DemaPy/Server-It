-- CreateEnum
CREATE TYPE "Role" AS ENUM ('GUEST', 'USER', 'ADMIN', 'DEVELOPER', 'PROJECT_MANAGER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(40) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "password" VARCHAR(100) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "templateId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Layout" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "sectionId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "renderOn" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL,

    CONSTRAINT "Layout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Component" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComponentPlaceholder" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fallback" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,

    CONSTRAINT "ComponentPlaceholder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionPlaceholder" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fallback" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,

    CONSTRAINT "SectionPlaceholder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- CreateIndex
CREATE INDEX "Template_id_idx" ON "Template"("id");

-- CreateIndex
CREATE INDEX "Template_userId_idx" ON "Template"("userId");

-- CreateIndex
CREATE INDEX "Campaign_id_idx" ON "Campaign"("id");

-- CreateIndex
CREATE INDEX "Campaign_templateId_idx" ON "Campaign"("templateId");

-- CreateIndex
CREATE INDEX "Layout_id_idx" ON "Layout"("id");

-- CreateIndex
CREATE INDEX "Layout_campaignId_idx" ON "Layout"("campaignId");

-- CreateIndex
CREATE INDEX "Layout_sectionId_idx" ON "Layout"("sectionId");

-- CreateIndex
CREATE INDEX "Section_id_idx" ON "Section"("id");

-- CreateIndex
CREATE INDEX "Section_templateId_idx" ON "Section"("templateId");

-- CreateIndex
CREATE INDEX "Component_id_idx" ON "Component"("id");

-- CreateIndex
CREATE INDEX "ComponentPlaceholder_id_idx" ON "ComponentPlaceholder"("id");

-- CreateIndex
CREATE INDEX "ComponentPlaceholder_componentId_idx" ON "ComponentPlaceholder"("componentId");

-- CreateIndex
CREATE INDEX "SectionPlaceholder_id_idx" ON "SectionPlaceholder"("id");

-- CreateIndex
CREATE INDEX "SectionPlaceholder_sectionId_idx" ON "SectionPlaceholder"("sectionId");

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Layout" ADD CONSTRAINT "Layout_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Layout" ADD CONSTRAINT "Layout_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentPlaceholder" ADD CONSTRAINT "ComponentPlaceholder_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionPlaceholder" ADD CONSTRAINT "SectionPlaceholder_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;
