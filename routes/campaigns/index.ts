import { Router } from "express";
import { Request, Response } from "express";
import { prisma } from "../../db";
import { Campaign, Layout, User } from "@prisma/client";
import { campaignDTO } from "../../middlewares/DTOS/campaignDTO";
import { JsonObject } from "@prisma/client/runtime/library";
import { CampaignValidation } from "./validation";
import { validationResult } from "express-validator";

export const campaignRouter = Router();
const Validation = new CampaignValidation();

campaignRouter.get("/", async (req: Request, res: Response) => {
  try {
    const user = req.body.user;
    const campaigns = await prisma.campaign.findMany({
      where: {
        userId: user.id,
      },
    });
    res.send({
      status: "success",
      message: "",
      data: campaigns,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: "Something went wrong",
      error: error,
      data: null,
    });
  }
});

campaignRouter.get(
  "/:id",
  Validation.get(),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({
          status: "error",
          message: "Validation error",
          ...errors,
        });
      }

      const { id } = req.params;
      const user = req.body.user;
      const campaign = await prisma.campaign.findUnique({
        where: {
          id: id,
          userId: user.id,
        },
        include: {
          layout: true,
          template: {
            select: {
              sections: {
                include: {
                  placeholders: true,
                },
              },
            },
          },
        },
      });
      res.send({
        status: "success",
        message: campaign === null ? "Campaign not found" : "Campaign found",
        data: campaign,
      });
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: "Something went wrong",
        data: null,
      });
    }
  }
);

campaignRouter.post(
  "/",
  Validation.create(),
  campaignDTO,
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({
          status: "error",
          message: "Validation error",
          ...errors,
        });
      }

      const user: User = req.body.user;
      const campaign: Omit<Campaign, "id"> = req.body.campaign;
      const template = await prisma.template.findUnique({
        where: {
          id: campaign.templateId,
          userId: user.id,
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
          userId: user.id,
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
      res.status(400).send({
        status: "error",
        message: "Campaign hasn't been created.",
        data: req.body.campaign,
      });
    }
  }
);

campaignRouter.post("/:id/data", Validation.create(), async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        status: "error",
        message: "Validation error",
        ...errors,
      });
    }

    const { id } = req.params;
    const user: User = req.body.user;
    delete req.body.user;
    const placeholder_data: Record<
      string,
      Record<string, Record<string, string>>
    > = req.body;

    const sectionId = Object.keys(placeholder_data)[0];

    const campaign = await prisma.campaign.findUnique({
      where: {
        id: id,
        userId: user.id,
      },
      include: {
        layout: {
          where: {
            sectionId: sectionId,
          },
        },
      },
    });
    if (!campaign) {
      throw new Error("Campaign not found.");
    }

    const section = await prisma.section.findUnique({
      where: {
        id: sectionId,
      },
    });
    if (!section) {
      throw new Error("Section not found.");
    }

    let isSectionWithDataExists = false;
    if (sectionId in (campaign.data as JsonObject)) {
      isSectionWithDataExists = true;
    }

    const generateSlugs = () => {
      const _slugs = {};
      const allSlugs = Object.values(Object.values(placeholder_data)[0]);
      for (const iterator of allSlugs) {
        const slugs = Object.keys(iterator);
        for (const slug of slugs) {
          if (slug in _slugs) {
            continue;
          } else {
            if (slug !== "") {
              _slugs[slug] = true;
            }
          }
        }
      }
      return _slugs;
    };

    const updated_campaign = await prisma.campaign.update({
      where: {
        id: id,
      },
      data: {
        data: isSectionWithDataExists
          ? {
              ...(campaign.data as JsonObject),
              [sectionId]: {
                ...campaign.data[sectionId],
                ...placeholder_data[sectionId],
              },
            }
          : {
              ...(campaign.data as JsonObject),
              ...placeholder_data,
            },
      },
    });

    await prisma.layout.update({
      where: {
        id: campaign.layout[0].id,
      },
      data: {
        renderOn: generateSlugs(),
      },
    });

    res.send({
      status: "success",
      message: "Campaign data has been created.",
      data: updated_campaign,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: "Campaign data hasn't been created.",
      data: req.body.campaign,
    });
  }
});

campaignRouter.patch("/", campaignDTO, async (req: Request, res: Response) => {
  try {
    const user: User = req.body.user;
    const campaign: Campaign = req.body.campaign;
    const updatedCampaign = await prisma.campaign.update({
      where: {
        id: campaign.id,
        userId: user.id,
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
    res.status(400).send({
      status: "error",
      message: "Campaign hasn't been updated.",
      data: req.body.campaign,
    });
  }
});

campaignRouter.delete(
  "/:id",
  Validation.delete(),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({
          status: "error",
          message: "Validation error",
          ...errors,
        });
      }

      const { id } = req.params;
      const user: User = req.body.user;
      const deletedCampaign = await prisma.campaign.delete({
        where: {
          id: id,
          userId: user.id,
        },
      });
      res.send({
        status: "success",
        message: "Campaign has been deleted.",
        data: deletedCampaign,
      });
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: "Campaign hasn't been deleted.",
        data: { id: req.params.id },
      });
    }
  }
);

campaignRouter.delete(
  "/data/:id",
  Validation.delete(),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({
          status: "error",
          message: "Validation error",
          ...errors,
        });
      }

      const { id } = req.params;
      const user: User = req.body.user;
      const deletedCampaign = await prisma.campaign.delete({
        where: {
          id: id,
          userId: user.id,
        },
      });
      res.send({
        status: "success",
        message: "Campaign has been deleted.",
        data: deletedCampaign,
      });
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: "Campaign hasn't been deleted.",
        data: { id: req.params.id },
      });
    }
  }
);
