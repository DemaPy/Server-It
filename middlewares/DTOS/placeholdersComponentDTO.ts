import { Request, Response, NextFunction } from "express";

export const placeholderDTO =
  (DTO) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const placeholder = new DTO(req.body.placeholder);
      req.body.placeholder = placeholder;
      next();
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message || "Bad Request",
      });
      console.error(error);
    }
  };
