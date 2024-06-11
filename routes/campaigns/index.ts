// var json = [
//     { name: 'Bob the dog' },
//     { name: 'Claudine the cat' },
//   ] as Prisma.JsonArray

//   const createUser = await prisma.user.create({
//     data: {
//       email: 'birgitte@prisma.io',
//       extendedPetsData: json,
//     },
//   })
// https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-json-fields

import { Router } from "express";
import { Request, Response } from "express";
import { prisma } from "../../db";
import { Campaign, Layout, User } from "@prisma/client";
import { campaignDTO } from "../../middlewares/DTOS/campaignDTO";

export const campaignRouter = Router();

campaignRouter.get("/", async (req: Request, res: Response) => {
  try {
    const campaigns = await prisma.campaign.findMany();
    res.send({
      status: "success",
      message: "",
      data: campaigns,
    });
  } catch (error) {
    res.send({
      status: "error",
      message: "Something went wrong",
      error: error,
      data: null,
    });
  }
});

campaignRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const campaign = await prisma.campaign.findUnique({
      where: {
        id: id,
      },
      include: {
        layout: true,
        template: {
          select: {
            sections: {
              include: {
                placeholders: true
              }
            }
          }
        }
      },
    });
    res.send({
      status: "success",
      message: campaign === null ? "Campaign not found" : "Campaign found",
      data: campaign,
    });
  } catch (error) {
    res.send({
      status: "error",
      message: "Something went wrong",
      data: null,
    });
  }
});

campaignRouter.post("/", campaignDTO, async (req: Request, res: Response) => {
  try {
    const user: User = req.body.user;
    const campaign: Omit<Campaign, "id"> = req.body.campaign;
    const template = await prisma.template.findUnique({
      where: {
        id: campaign.templateId,
      },
      include: {
        sections: true,
      },
    });
    if (!template) {
      throw new Error("Template not found.");
    }
    
    const createdCampaign = await prisma.campaign.create({
      data: {
        title: campaign.title,
        css: campaign.css,
        data: {},
        templateId: campaign.templateId,
        userId: user.id
      },
    });

    let createdLayouts;
    if (template.sections.length > 0) {
      const layouts: Omit<Layout, "id">[] = template.sections.map(
        (item, idx) => ({
          order: idx,
          is_active: true,
          renderOn: {},
          sectionId: item.id,
          campaignId: createdCampaign.id,
        })
      );

      createdLayouts = await prisma.layout.createMany({
        data: layouts,
      });
    }

    res.send({
      status: "success",
      message: "Campaign has been created.",
      data: {...createdCampaign, layout: createdLayouts},
    });
  } catch (error) {
    res.send({
      status: "error",
      message: "Campaign hasn't been created.",
      data: req.body.campaign
    });
  }
});

campaignRouter.patch("/", campaignDTO, async (req: Request, res: Response) => {
  try {
    const campaign: Campaign = req.body.campaign;
    const updatedCampaign = await prisma.campaign.update({
      where: {
        id: campaign.id,
      },
      data: {
        title: campaign.title,
      },
    });
    res.send({
      status: "success",
      message: "Campaign has been updated.",
      data: updatedCampaign,
    });
  } catch (error) {
    res.send({
      status: "error",
      message: "Campaign hasn't been updated.",
      data: req.body.campaign
    });
  }
});

campaignRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCampaign = await prisma.campaign.delete({
      where: {
        id: id,
      },
    });
    res.send({
      status: "success",
      message: "Campaign has been deleted.",
      data: deletedCampaign,
    });
  } catch (error) {
    res.send({
      status: "error",
      message: "Campaign hasn't been deleted.",
      data: { id: req.params.id },
    });
  }
});

campaignRouter.delete("/data/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCampaign = await prisma.campaign.delete({
      where: {
        id: id,
      },
    });
    res.send({
      status: "success",
      message: "Campaign has been deleted.",
      data: deletedCampaign,
    });
  } catch (error) {
    res.send({
      status: "error",
      message: "Campaign hasn't been deleted.",
      data: { id: req.params.id },
    });
  }
});