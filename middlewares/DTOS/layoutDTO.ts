import { Request, Response, NextFunction } from "express";

export const layoutDTO = (DTO) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const layout = new DTO(req.body.layout);
    req.body.layout = layout;
    next();
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message || "Bad Request",
    });
    console.error(error);
  }
};

