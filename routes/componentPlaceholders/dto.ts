import { ComponentPlaceholder } from "@prisma/client";

export class ComponentPlaceholderDTO {
  static extractFields(placeholder: any): ComponentPlaceholder | Error {
    if (!placeholder || Array.isArray(placeholder)) {
      throw Error("Placeholder not found");
    }

    try {
      const DTO: ComponentPlaceholder = {
        id: placeholder.id,
        title: placeholder.title,
        componentId: placeholder.componentId,
        fallback: placeholder.fallback,
        position: placeholder.position,
      };
      return DTO;
    } catch (error) {
      throw error;
    }
  }
}
