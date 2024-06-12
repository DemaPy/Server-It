import { Router } from "express";
import { templateDTO } from "../../middlewares/DTOS/templateDTO";
import { TemplateController } from "../../entities/template/controller";
import { CreateTemplateDTO, UpdateTemplateDTO } from "./dto";
import { TemplateValidation } from "./validation";

export const templateRouter = Router();
const Controller = new TemplateController();
const Validation = new TemplateValidation();

templateRouter.get("/", Controller.getAll);

templateRouter.get("/:id", Validation.get(), Controller.getOne);

templateRouter.post(
  "/",
  Validation.create(),
  templateDTO(CreateTemplateDTO),
  Controller.create
);

templateRouter.patch(
  "/",
  Validation.update(),
  templateDTO(UpdateTemplateDTO),
  Controller.update
);

templateRouter.delete("/:id", Validation.delete(), Controller.delete);
