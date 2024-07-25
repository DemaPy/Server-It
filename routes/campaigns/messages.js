"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaign_validation_messages = exports.campaign_validation_keys = void 0;
exports.campaign_validation_keys = {
    title: "campaign.title",
    data: "campaign.data",
    id: "campaign.id",
    templateId: "campaign.templateId",
    userId: "campaign.userId",
};
exports.campaign_validation_messages = {
    "campaign.data": "",
    "campaign.id": "Id is not valid.",
    "campaign.templateId": "Template id is not valid.",
    "campaign.title": "Max: 35, Min: 3 symbols",
    "campaign.userId": "",
};
