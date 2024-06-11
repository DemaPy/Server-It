import { SectionPlaceholder } from "@prisma/client";

export class SectionPlaceholderDTO {
  static extractFields(placeholder: any): SectionPlaceholder | Error {
    if (!placeholder || Array.isArray(placeholder)) {
      throw Error("Placeholder not found");
    }

    try {
      const DTO: SectionPlaceholder = {
        id: placeholder.id,
        title: placeholder.title,
        fallback: placeholder.fallback,
        position: placeholder.position,
        sectionId: placeholder.sectionId,
      };
      return DTO;
    } catch (error) {
      throw error;
    }
  }
}
