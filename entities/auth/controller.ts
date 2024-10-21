import { Role, User } from "@prisma/client";
import { prisma } from "../../db";
import { userDTO } from "../user/dto";
import * as bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import * as jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export type UserToken = {
  id: User["id"];
  role: User["role"];
};

const generateAccessToken = (data: UserToken) => {
  const payload = {
    id: data.id,
    role: data.role,
  };
  const token = jwt.sign(payload, "MY_SUPER_SECRET_KEY", {
    expiresIn: "4h",
  });
  return token;
};

const saltRounds = 10;

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Check if data to login user is exists
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({
          status: "error",
          message: "Validation error",
          ...errors,
        });
      }
      const data = req.body;
      if ("email" in data && "password" in data) {
        userDTO["email"] = data.email;
        userDTO["password"] = data.password;
      } else {
        throw new Error("Validation error");
      }
      // Check if user with email exists
      const candidate = await prisma.user.findUnique({
        where: {
          email: userDTO.email,
        },
      });
      if (!candidate) {
        throw new Error(`User not found.`);
      }

      const isPasswordCorrect = await bcrypt.compare(
        userDTO.password,
        candidate.password
      );
      if (!isPasswordCorrect) {
        throw new Error("Password is not correct.");
      }

      const token = generateAccessToken(candidate);

      // res.cookie("accessToken", token, {maxAge: 3600, httpOnly: true})
      return res.json({ status: "success", data: { token } });
    } catch (error) {
      next(error);
    }
  }

  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({
          status: "error",
          message: "Validation error",
          errors,
        });
      }

      // Check if data to create new user is exists
      const data = req.body;
      if ("email" in data && "password" in data) {
        userDTO["email"] = data.email;
        userDTO["password"] = data.password;
      } else {
        throw new Error("Validation error");
      }
      // Check if user with email already exist
      const candidate = await prisma.user.findUnique({
        where: {
          email: userDTO.email,
        },
      });

      if (candidate) {
        throw new Error("User already exists");
      }

      const hashedPassword = await bcrypt.hash(userDTO.password, saltRounds);
      const withHashedPassword = {
        ...userDTO,
        password: hashedPassword,
      };

      const { password, ...rest } = await prisma.user.create({
        data: {
          ...withHashedPassword,
          role: Role.USER,
          name: "dema",
        },
      });

      // Return only NOT sensitive data
      return res
        .status(200)
        .json({ data: "Blocked to register new user.", status: "success" });
    } catch (error) {
      next(error);
    }
  }
}
