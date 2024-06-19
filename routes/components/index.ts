import { Router } from "express";
import { componentDTO } from "../../middlewares/DTOS/componentDTO";
import { ComponentController } from "../../entities/component/controller";
import { ComponentValidation } from "./validation";
import { CreateComponentDTO, UpdateComponentDTO } from "./dto";
import { MIDDLEWARES } from "../../middlewares/guard";

export const componentRouter = Router();
const Controller = new ComponentController();
const Validation = new ComponentValidation();

componentRouter.get("/", MIDDLEWARES.guest, Controller.getAll);

componentRouter.get(
  "/:id",
  MIDDLEWARES.guest,
  Validation.get(),
  Controller.getOne
);

componentRouter.post(
  "/",
  MIDDLEWARES.user,
  Validation.create(),
  componentDTO(CreateComponentDTO),
  Controller.create
);

componentRouter.patch(
  "/",
  MIDDLEWARES.user,
  Validation.update(),
  componentDTO(UpdateComponentDTO),
  Controller.update
);

componentRouter.delete(
  "/:id",
  MIDDLEWARES.user,
  Validation.delete(),
  Controller.delete
);
