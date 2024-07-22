import { Request, Response, NextFunction } from "express";

export const sectionDTO = (DTO) => (req: Request, res: Response, next: NextFunction) => {
  try {
    const section = new DTO(req.body.section);
    req.body.section = section;
    next();
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message || "Bad Request",
    });
    console.error(error);
  }
};
