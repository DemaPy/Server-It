import { Prisma, Template, User } from "@prisma/client";
import { prisma } from "../db";

type Props = {
  templatId: Template["id"];
  userId: User["id"];
  include?: Prisma.TemplateInclude
};

export async function isTemplateExist({ templatId, userId, include = {} }: Props) {
 const template = await prisma.template.findUnique({
    where: {
      id: templatId,
      userId: userId,
    },
    include: include
  });
  if (!template) {
    throw new Error("Template doesn't exist for this section.");
  }
  return template
}
