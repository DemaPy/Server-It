import { Placeholder } from "@prisma/client";

export class PlaceholderDTO {
  static extractFields(placeholder: any): Placeholder | Error {
    if (!placeholder || Array.isArray(placeholder)) {
      throw Error("Placeholder not found");
    }

    try {
      const DTO: Placeholder = {
        id: placeholder.id,
        title: placeholder.title,
        componentId: placeholder.componentId,
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
