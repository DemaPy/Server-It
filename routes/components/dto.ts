import { Component, ComponentPlaceholder } from "@prisma/client";

export class CreateComponentDTO {
  title: Component["title"];
  content: Component["content"];
  constructor(data: any) {
    this.title = data.title;
    this.content = data.content;
  }
}

export class UpdateComponentDTO {
  id: Component["id"];
  title: Component["title"];
  content: Component["content"];
  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
  }
}
