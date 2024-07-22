import { Component, ComponentPlaceholder } from "@prisma/client";

export class CreateComponentPlaceholderDTO {
  componentId: ComponentPlaceholder["componentId"];
  content: Component["content"];
  placeholders: ComponentPlaceholder[] = [];
  constructor(data: any) {
    this.componentId = data.id;
    this.content = data.content;
    for (const placeholder of data.placeholders) {
      this.placeholders.push({
        id: placeholder.id,
        fallback: placeholder.fallback,
        title: placeholder.title,
        componentId: data.id
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
