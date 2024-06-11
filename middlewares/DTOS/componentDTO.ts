import { Request, Response, NextFunction } from "express";
import { ComponentDTO } from "../../routes/components/dto";

export const componentDTO = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const component = ComponentDTO.extractFields(req.body);
    req.body.component = component;
    next();
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: "Bad Request",
      error: error,
      data: null,
    });
    console.error(error);
  }
};
