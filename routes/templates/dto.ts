import { Template } from "@prisma/client"

export class CreateTemplateDTO {
  title: Template['title']
  constructor(data: any) {
    this.title = data.title
  }
}

export class UpdateTemplateDTO {
  id: Template['id']
  title: Template['title']
  constructor(data: any) {
    this.id = data.id
    this.title = data.title
  }
}
