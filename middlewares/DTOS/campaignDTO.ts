import { Request, Response, NextFunction } from "express";

export const campaignDTO = (DTO) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const campaign = new DTO(req.body.campaign);
    req.body.campaign = campaign;
    next();
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message || "Bad Request",
    });
    console.error(error);
  }
};
