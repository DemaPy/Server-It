import { Request, Response, NextFunction } from "express";
import { CampaignDTO } from "../../routes/campaigns/dto";

export const campaignDTO = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const campaign = CampaignDTO.extractFields(req.body);
    req.body.campaign = campaign;
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
