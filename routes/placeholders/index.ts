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
import { Campaign, Layout, Placeholder } from "@prisma/client";
import { placeholderDTO } from "../../middlewares/DTOS/placeholderDTO";

export const placeholderRouter = Router();

// placeholderRouter.get("/", async (req: Request, res: Response) => {
//   try {
//     const campaigns = await prisma.placeholder.findMany();
//     res.send({
//       status: "success",
//       message: "",
//       data: campaigns,
//     });
//   } catch (error) {
//     res.send({
//       status: "error",
//       message: "Something went wrong",
//       error: error,
//       data: null,
//     });
//   }
// });

// placeholderRouter.get("/:id", async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const campaign = await prisma.placeholder.findUnique({
//       where: {
//         id: id,
//       },
//     });
//     res.send({
//       status: "success",
//       message: campaign === null ? "Placeholder not found" : "Placeholder found",
//       data: campaign,
//     });
//   } catch (error) {
//     res.send({
//       status: "error",
//       message: "Something went wrong",
//       data: null,
//     });
//   }
// });

placeholderRouter.post(
  "/",
  placeholderDTO,
  async (req: Request, res: Response) => {
    try {
      const campaign: Campaign = req.body;
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
          data: [],
          templateId: campaign.templateId,
          userId: campaign.userId,
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
        data: { ...createdCampaign, layout: createdLayouts },
      });
    } catch (error) {
      res.send({
        status: "error",
        message: "Campaign hasn't been created.",
        data: req.body,
      });
    }
  }
);

placeholderRouter.patch(
  "/",
  placeholderDTO,
  async (req: Request, res: Response) => {
    try {
      const placeholder: Placeholder = req.body.placeholder;
      const updatedPlaceholder = await prisma.placeholder.update({
        where: {
          id: placeholder.id,
        },
        data: {
          title: placeholder.title,
        },
      });
      res.send({
        status: "success",
        message: "Placeholder has been updated.",
        data: updatedPlaceholder,
      });
    } catch (error) {
      res.send({
        status: "error",
        message: "Placeholder hasn't been updated.",
        data: req.body,
      });
    }
  }
);

placeholderRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCampaign = await prisma.placeholder.delete({
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
