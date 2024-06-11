import { Request, Response, NextFunction } from "express";
import { SectionDTO } from "../../routes/sections/dto";

export const sectionDTO = (req: Request, res: Response, next: NextFunction) => {
  try {
    const section = SectionDTO.extractFields(req.body);
    req.body.section = section;
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
