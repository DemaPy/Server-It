import { Request, Response, NextFunction } from "express";

export const componentDTO =
  (DTO) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const component = new DTO(req.body.component);
      req.body.component = component;
      next();
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message || "Bad Request",
      });
      console.error(error);
    }
  };
