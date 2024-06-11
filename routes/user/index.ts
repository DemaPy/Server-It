import { Router } from "express";
import { UserController } from "../../entities/user/controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { roleMiddleware } from "../../middlewares/roleMiddleware";

export const userRouter = Router();
const Controller = new UserController();

userRouter.get(
  "/",
  [authMiddleware, roleMiddleware(["DEVELOPER", "PROJECT_MANAGER"])],
  Controller.getAllUsers
);
userRouter.get("/:id", Controller.getById);
