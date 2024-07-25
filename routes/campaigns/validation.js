"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignValidation = void 0;
var express_validator_1 = require("express-validator");
var messages_1 = require("./messages");
var CampaignValidation = /** @class */ (function () {
    function CampaignValidation() {
    }
    CampaignValidation.prototype.get = function () {
        return [(0, express_validator_1.param)("id", "Id is not valid.").exists().notEmpty().isString()];
    };
    CampaignValidation.prototype.create = function () {
        return [
            (0, express_validator_1.check)(messages_1.campaign_validation_keys.title, messages_1.campaign_validation_messages[messages_1.campaign_validation_keys.title])
                .exists()
                .notEmpty()
                .isString()
                .isLength({
                max: 20,
                min: 3,
            }),
            (0, express_validator_1.check)(messages_1.campaign_validation_keys.templateId, messages_1.campaign_validation_messages[messages_1.campaign_validation_keys.templateId])
                .exists()
                .notEmpty()
                .isString()
                .isLength({
                min: 3,
            }),
        ];
    };
    CampaignValidation.prototype.createData = function () {
        return [];
    };
    CampaignValidation.prototype.update = function () {
        return [
            (0, express_validator_1.check)(messages_1.campaign_validation_keys.id, messages_1.campaign_validation_messages[messages_1.campaign_validation_keys.id])
                .exists()
                .notEmpty()
                .isString(),
            (0, express_validator_1.check)(messages_1.campaign_validation_keys.title, messages_1.campaign_validation_messages[messages_1.campaign_validation_keys.title])
                .exists()
                .notEmpty()
                .isString()
                .isLength({
                max: 35,
                min: 3,
            }),
        ];
    };
    CampaignValidation.prototype.delete = function () {
        return [
            (0, express_validator_1.param)("id", messages_1.campaign_validation_messages[messages_1.campaign_validation_keys.id])
                .exists()
                .notEmpty()
                .isString(),
        ];
    };
    return CampaignValidation;
}());
exports.CampaignValidation = CampaignValidation;
