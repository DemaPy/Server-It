import { Campaign } from "@prisma/client";

type CampaignValidation = {
  [T in keyof Campaign]: `campaign.${T}`;
};

export const campaign_validation_keys: CampaignValidation = {
  title: "campaign.title",
  data: "campaign.data",
  id: "campaign.id",
  templateId: "campaign.templateId",
  userId: "campaign.userId",
};
type CampaignKeys = CampaignValidation[keyof CampaignValidation];
export const campaign_validation_messages: Record<CampaignKeys, string> = {
  "campaign.data": "",
  "campaign.id": "Id is not valid.",
  "campaign.templateId": "Template id is not valid.",
  "campaign.title": "Max: 35, Min: 3 symbols",
  "campaign.userId": "",
};
