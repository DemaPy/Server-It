import { Request, Response, NextFunction } from "express";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

export function handlePrismaError(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      res.status(400).send({
        status: "error",
        message: "DB error happend",
      });
      return;
    }
    if (err instanceof PrismaClientValidationError) {
      // The .code property can be accessed in a type-safe manner
      res.status(400).send({
        status: "error",
        message: "DB validation error happend",
      });
      return;
    }
    res.status(400).send({
      status: "error",
      message: "Something went wrong",
    });
  } else {
    next(err);
  }
}

export function logErrors(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);
  next(err);
}
