"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCampaignDataDTO = exports.UpdateCampaignDTO = exports.CreateCampaignDTO = void 0;
var CreateCampaignDTO = /** @class */ (function () {
    function CreateCampaignDTO(data) {
        this.title = data.title;
        this.templateId = data.templateId;
    }
    return CreateCampaignDTO;
}());
exports.CreateCampaignDTO = CreateCampaignDTO;
var UpdateCampaignDTO = /** @class */ (function () {
    function UpdateCampaignDTO(data) {
        this.id = data.id;
        this.title = data.title;
    }
    return UpdateCampaignDTO;
}());
exports.UpdateCampaignDTO = UpdateCampaignDTO;
var CreateCampaignDataDTO = /** @class */ (function () {
    function CreateCampaignDataDTO(data) {
        this.data = data;
    }
    return CreateCampaignDataDTO;
}());
exports.CreateCampaignDataDTO = CreateCampaignDataDTO;
