import { Campaign, Prisma } from "@prisma/client";

export class CampaignDTO {
  static extractFields(campaign: any): Campaign | Error {
    if (!campaign || Array.isArray(campaign)) {
      throw Error("Campaign not found");
    }
    try {
      const DTO: Campaign = {
        id: campaign.id,
        css: campaign.css,
        title: campaign.title,
        templateId: campaign.templateId,

        userId: campaign.userId,
        data: [] as Prisma.JsonArray,
      };
      return DTO;
    } catch (error) {
      throw error;
    }
  }
}
