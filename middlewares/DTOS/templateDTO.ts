import { Request, Response, NextFunction } from "express";
import { TemplateDTO } from "../../routes/templates/dto";
import { Template } from "@prisma/client";

export const templateDTO = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const template = TemplateDTO.extractFields(req.body);
    req.body.template = template;
    next();
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: "Bad Request" + error.message,
      data: null,
      error: error,
    });
    console.error(error);
  }
};
