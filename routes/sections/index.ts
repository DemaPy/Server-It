import { Router } from "express";
import { sectionDTO } from "../../middlewares/DTOS/sectionDTO";
import { SectionValidation } from "./validation";
import { SectionController } from "../../entities/section/controller";
import { CreateSectionDTO, UpdateSectionDTO } from "./dto";

export const sectionRouter = Router();
const Controller = new SectionController();
const Validation = new SectionValidation();

sectionRouter.post(
  "/:id",
  Validation.duplicate(),
  Controller.duplicate
);

sectionRouter.post(
  "/",
  Validation.create(),
  sectionDTO(CreateSectionDTO),
  Controller.create
);

sectionRouter.patch("/", sectionDTO(UpdateSectionDTO), Controller.update);

sectionRouter.delete("/:id", Validation.delete(), Controller.delete);
