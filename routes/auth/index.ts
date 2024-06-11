import { Router } from "express";
import { AuthController } from "../../entities/auth/controller";
import { check } from "express-validator";

export const authRouter = Router();
const Controller = new AuthController();

authRouter.post("/login", Controller.login);
authRouter.post(
  "/registration",
  [
    check("email", "Email is not valid").notEmpty().isEmail(),
    check("password", "Password is not valid").notEmpty().isLength({
      min: 4,
      max: 10,
    }),
  ],
  Controller.registration
);
