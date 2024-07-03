import { ComponentPlaceholder } from "@prisma/client";

type CreateComponentPlaceholderDTOObject = {
  id: ComponentPlaceholder["id"];
  title: ComponentPlaceholder["title"];
  fallback: ComponentPlaceholder["fallback"];
  componentId: ComponentPlaceholder["componentId"];
}

export class CreateComponentPlaceholderDTO {
  placeholders: CreateComponentPlaceholderDTOObject[] = []
  constructor(data: any) {
    if (!("placeholders" in data)) {
      throw new Error("Bad request");
    }
    if (data.placeholders.length === 0) {
      throw new Error("Bad request");
    }

    for (const placeholder of data.placeholders) {
      this.placeholders.push({
        componentId: placeholder.componentId,
        fallback: placeholder.fallback,
        id: placeholder.id,
        title: placeholder.title,
      });
    }
  }
}

export class UpdateComponentPlaceholderDTO {
  id: ComponentPlaceholder["id"];
  title: ComponentPlaceholder["title"];
  fallback: ComponentPlaceholder["fallback"];
  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.fallback = data.fallback;
  }
}
