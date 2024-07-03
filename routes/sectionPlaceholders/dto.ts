import { SectionPlaceholder } from "@prisma/client";

type CreateSectionPlaceholderDTOObject = {
  id: SectionPlaceholder["id"];
  title: SectionPlaceholder["title"];
  fallback: SectionPlaceholder["fallback"];
  sectionId: SectionPlaceholder["sectionId"];
}

export class CreateSectionPlaceholderDTO {
  placeholders: CreateSectionPlaceholderDTOObject[] = []
  constructor(data: any) {
    if (!("placeholders" in data)) {
      throw new Error("Bad request");
    }
    if (data.placeholders.length === 0) {
      throw new Error("Bad request");
    }

    for (const placeholder of data.placeholders) {
      this.placeholders.push({
        sectionId: placeholder.sectionId,
        fallback: placeholder.fallback,
        id: placeholder.id,
        title: placeholder.title,
      });
    }
  }
}

export class UpdateSectionPlaceholderDTO {
  id: SectionPlaceholder["id"];
  title: SectionPlaceholder["title"];
  fallback: SectionPlaceholder["fallback"];
  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.fallback = data.fallback;
  }
}
