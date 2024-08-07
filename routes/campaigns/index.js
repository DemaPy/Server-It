"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignRouter = void 0;
var express_1 = require("express");
var campaignDTO_1 = require("../../middlewares/DTOS/campaignDTO");
var validation_1 = require("./validation");
var dto_1 = require("./dto");
var guard_1 = require("../../middlewares/guard");
var controller_1 = require("../../entities/campaign/controller");
exports.campaignRouter = (0, express_1.Router)();
var Validation = new validation_1.CampaignValidation();
var Controller = new controller_1.CampaignController();
exports.campaignRouter.get("/", guard_1.MIDDLEWARES.guest, Controller.getAll);
exports.campaignRouter.get("/:id", guard_1.MIDDLEWARES.guest, Validation.get(), Controller.getOne);
exports.campaignRouter.post("/", guard_1.MIDDLEWARES.user, Validation.create(), (0, campaignDTO_1.campaignDTO)(dto_1.CreateCampaignDTO), Controller.create);
exports.campaignRouter.post("/:id/data", guard_1.MIDDLEWARES.user, Validation.createData(), (0, campaignDTO_1.campaignDTO)(dto_1.CreateCampaignDataDTO), Controller.createData);
exports.campaignRouter.patch("/", guard_1.MIDDLEWARES.user, Validation.update(), (0, campaignDTO_1.campaignDTO)(dto_1.UpdateCampaignDTO), Controller.update);
exports.campaignRouter.delete("/:id", guard_1.MIDDLEWARES.user, Validation.delete(), Controller.delete);
exports.campaignRouter.delete("/data/:id", guard_1.MIDDLEWARES.user, Validation.delete(), Controller.deleteData);
