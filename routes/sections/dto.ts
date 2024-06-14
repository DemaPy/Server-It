import { Section } from "@prisma/client";

export class CreateSectionDTO {
  content: Section['content']
  title: Section['title']
  templateId: Section['templateId']
  constructor(data: any) {
    this.title = data.title
    this.templateId = data.templateId
    this.content = data.content
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