import { Router } from "express";
import { sectionDTO } from "../../middlewares/DTOS/sectionDTO";
import { SectionValidation } from "./validation";
import { SectionController } from "../../entities/section/controller";
import { CreateSectionDTO, UpdateSectionDTO } from "./dto";
import { MIDDLEWARES } from "../../middlewares/guard";

export const sectionRouter = Router();
const Controller = new SectionController();
const Validation = new SectionValidation();

sectionRouter.post(
  "/:id",
  MIDDLEWARES.user,
  Validation.duplicate(),
  Controller.duplicate
);

sectionRouter.post(
  "/",
  MIDDLEWARES.user,
  Validation.create(),
  sectionDTO(CreateSectionDTO),
  Controller.create
);

sectionRouter.patch(
  "/",
  MIDDLEWARES.user,
  Validation.update(),
  sectionDTO(UpdateSectionDTO),
  Controller.update
);

sectionRouter.delete(
  "/:id",
  MIDDLEWARES.user,
  Validation.delete(),
  Controller.delete
);
