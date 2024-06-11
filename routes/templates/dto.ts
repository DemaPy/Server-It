import { Template } from "@prisma/client";

export class TemplateDTO {
  static extractFields(template: any): Template | Error {
    if (!template || Array.isArray(template)) {
      throw Error("Template not found");
    }
    try {
      const DTO: Template = {
        userId: template.userId,
        id: template.id,
        title: template.title,
      };
      return DTO;
    } catch (error) {
      throw error;
    }
  }
}
