import { Component, Section, SectionPlaceholder, Template } from "@prisma/client";

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

export class CreateSectionFromComponentDTO {
  templateId: Template["id"];
  componentId: Component["id"];
  constructor(data: any) {
    this.componentId = data.componentId
    this.templateId = data.templateId
  }
}

export class UpdateSectionDTO {
  id: Section['id']
  title: Section['title']
  content: Section['content']
  templateId: Section['templateId']
  placeholders: SectionPlaceholder[]
  constructor(data: any) {
    this.id = data.id
    this.title = data.title
    this.content = data.content
    this.templateId = data.templateId
    this.placeholders = data.placeholders
  }
}