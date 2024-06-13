import { Section } from "@prisma/client";

export class CreateSectionDTO {
  title: Section['title']
  constructor(data: any) {
    this.title = data.title
  }
}

export class UpdateSectionDTO {
  title: Section['title']
  content: Section['content']
  constructor(data: any) {
    this.title = data.title
    this.content = data.content
  }
}