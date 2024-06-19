import { Campaign } from "@prisma/client";

export class CreateCampaignDTO {
  css: Campaign["css"];
  title: Campaign["title"];
  templateId: Campaign["templateId"];
  constructor(data: any) {
    this.title = data.title;
    this.templateId = data.templateId;
    this.css = data.css;
  }
}

export class UpdateCampaignDTO {
  id: Campaign["id"];
  title: Campaign["title"];
  css: Campaign["css"];
  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.css = data.css;
  }
}
