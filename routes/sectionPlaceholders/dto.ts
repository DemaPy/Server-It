import {
  ComponentPlaceholder,
  Section,
  SectionPlaceholder,
} from "@prisma/client";

export class CreateSectionPlaceholderDTO {
  sectionId: ComponentPlaceholder["componentId"];
  content: Section["content"];
  placeholders: SectionPlaceholder[] = [];
  constructor(data: any) {
    this.sectionId = data.id;
    this.content = data.content;
    for (const placeholder of data.placeholders) {
      this.placeholders.push({
        fallback: placeholder.fallback,
        title: placeholder.title,
        sectionId: data.id,
        id: placeholder.id,
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
