import { Router } from "express";
import { UserController } from "../../entities/user/controller";
import { param } from "express-validator";

export const userRouter = Router();
const Controller = new UserController();

userRouter.get("/", Controller.getAllUsers);
userRouter.get(
  "/:id",
  [param("id", "").exists().isString().notEmpty()],
  Controller.getById
);
