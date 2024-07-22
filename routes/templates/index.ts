import { Router } from "express";
import { templateDTO } from "../../middlewares/DTOS/templateDTO";
import { TemplateController } from "../../entities/template/controller";
import { CreateTemplateDTO, UpdateTemplateDTO } from "./dto";
import { TemplateValidation } from "./validation";
import { MIDDLEWARES } from "../../middlewares/guard";
import { validationResult } from "express-validator";

export const templateRouter = Router();
const Controller = new TemplateController();
const Validation = new TemplateValidation();

templateRouter.get("/", MIDDLEWARES.guest, Controller.getAll);

templateRouter.get(
  "/:id",
  MIDDLEWARES.guest,
  Validation.get(),
  Controller.getOne
);

templateRouter.post(
  "/",
  MIDDLEWARES.user,
  Validation.create(),
  templateDTO(CreateTemplateDTO),
  Controller.create
);

templateRouter.patch(
  "/",
  MIDDLEWARES.user,
  Validation.update(),
  templateDTO(UpdateTemplateDTO),
  Controller.update
);

templateRouter.delete(
  "/:id",
  MIDDLEWARES.user,
  Validation.delete(),
  Controller.delete
);
