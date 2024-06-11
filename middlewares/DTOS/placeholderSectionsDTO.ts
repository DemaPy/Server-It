import { Request, Response, NextFunction } from "express";
import { SectionPlaceholderDTO } from "../../routes/sectionPlaceholders/dto";

export const placeholderDTO = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const placeholder = SectionPlaceholderDTO.extractFields(req.body);
    console.log(placeholder);
    
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
