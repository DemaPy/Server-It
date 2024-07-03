import { Request, Response, NextFunction } from "express";

export const placeholderDTO =
  (DTO) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const placeholder = new DTO(req.body);
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
