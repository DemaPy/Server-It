import { Router } from "express";
import { campaignDTO } from "../../middlewares/DTOS/campaignDTO";
import { CampaignValidation } from "./validation";
import { CreateCampaignDTO, UpdateCampaignDTO } from "./dto";
import { MIDDLEWARES } from "../../middlewares/guard";
import { CampaignController } from "../../entities/campaign/controller";

export const campaignRouter = Router();
const Validation = new CampaignValidation();
const Controller = new CampaignController();

campaignRouter.get("/", MIDDLEWARES.guest, Controller.getAll);

campaignRouter.get(
  "/:id",
  MIDDLEWARES.guest,
  Validation.get(),
  Controller.getOne
);

campaignRouter.post(
  "/",
  MIDDLEWARES.user,
  Validation.create(),
  campaignDTO(CreateCampaignDTO),
  Controller.create
);

campaignRouter.post(
  "/:id/data",
  MIDDLEWARES.user,
  Validation.createData(),
  Controller.createData
);

campaignRouter.patch(
  "/",
  MIDDLEWARES.user,
  Validation.update(),
  campaignDTO(UpdateCampaignDTO),
  Controller.update
);

campaignRouter.delete(
  "/:id",
  MIDDLEWARES.user,
  Validation.delete(),
  Controller.delete
);

campaignRouter.delete(
  "/data/:id",
  MIDDLEWARES.user,
  Validation.delete(),
  Controller.deleteData
);
