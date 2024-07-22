import { Request, Response, NextFunction } from "express";

export const templateDTO = (DTO) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const template = new DTO(req.body.template);
    req.body.template = template;
    next();
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message || "Bad Request",
    });
    console.error(error);
  }
};
