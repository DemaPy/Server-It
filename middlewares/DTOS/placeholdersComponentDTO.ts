import { Request, Response, NextFunction } from "express";
import { ComponentPlaceholderDTO } from "../../routes/componentPlaceholders/dto";

export const placeholderDTO = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const placeholder = ComponentPlaceholderDTO.extractFields(req.body);
    req.body.placeholder = placeholder;
    next();
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: "Bad Request",
      data: null,
      error: error,
    });
    console.error(error);
  }
};
