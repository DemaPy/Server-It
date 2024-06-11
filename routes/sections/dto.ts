import { Section } from "@prisma/client";

export class SectionDTO {
  static extractFields(section: any): Section | Error {
    if (!section || Array.isArray(section)) {
      throw Error("Section not found");
    }
    try {
      const DTO: Section = {
        id: section.id,
        templateId: section.templateId,
        title: section.title,
        content: section.content,
      };
      return DTO;
    } catch (error) {
      throw error;
    }
  }
}
