import { Component } from "@prisma/client";

export class ComponentDTO {
  static extractFields(section: any): Component | Error {
    if (!section || Array.isArray(section)) {
      throw Error("Section not found");
    }
    
    try {
      const DTO: Component = {
        id: section.id,
        title: section.title,
        content: section.content,
      };
      return DTO;
    } catch (error) {
      throw error
    }
  }
}
