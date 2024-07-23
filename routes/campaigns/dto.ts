import { Campaign } from "@prisma/client";

export class CreateCampaignDTO {
  title: Campaign["title"];
  templateId: Campaign["templateId"];
  constructor(data: any) {
    this.title = data.title;
    this.templateId = data.templateId;
  }
}

export class UpdateCampaignDTO {
  id: Campaign["id"];
  title: Campaign["title"];
  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
  }
}

export class CreateCampaignDataDTO {
  data: Campaign["data"];
  constructor(data: any) {
    this.data = data;
  }
}
