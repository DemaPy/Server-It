import { Prisma, User } from "@prisma/client";
import { prisma } from "../db";

const userData: Prisma.UserCreateInput[] = [
  {
    email: "seed@gmail.com",
    name: "Seed",
    password: "",
    role: "USER",
  },
];
const templateData: Prisma.TemplateCreateInput[] = [];
const sectionData: Prisma.SectionCreateInput[] = [];
const componentData: Prisma.ComponentCreateInput[] = [];
const campaignData: Prisma.CampaignCreateInput[] = [];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
