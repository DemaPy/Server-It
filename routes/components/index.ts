import { Router } from "express";
import { componentDTO } from "../../middlewares/DTOS/componentDTO";
import { ComponentController } from "../../entities/component/controller";
import { ComponentValidation } from "./validation";
import { CreateComponentDTO, UpdateComponentDTO } from "./dto";

export const componentRouter = Router();
const Controller = new ComponentController();
const Validation = new ComponentValidation();

componentRouter.get("/", Controller.getAll);

componentRouter.get("/:id", Validation.get(), Controller.getOne);

componentRouter.post(
  "/",
  Validation.create(),
  componentDTO(CreateComponentDTO),
  Controller.create
);

componentRouter.patch(
  "/:position",
  Validation.update(),
  componentDTO(UpdateComponentDTO),
  Controller.update
);

componentRouter.delete("/:id", Validation.delete(), Controller.delete);
