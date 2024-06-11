import { Request, Response, NextFunction } from "express";
import { LayoutDTO } from "../../routes/layouts/dto";

export const layoutDTO = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const layout = LayoutDTO.extractFields(req.body);
    req.body.layout = layout;
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
