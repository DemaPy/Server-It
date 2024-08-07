import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { Controller } from "../type";
import { UserToken } from "../auth/controller";
import { prisma } from "../../db";
import { validationResult } from "express-validator";
import { Layout } from "@prisma/client";
import {
  CreateCampaignDataDTO,
  CreateCampaignDTO,
  UpdateCampaignDTO,
} from "../../routes/campaigns/dto";
import {
  JsonObject,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

export class CampaignController implements Controller {
  async create(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({
          status: "error",
          message: "Validation error",
          ...errors,
        });
      }

      const user: UserToken = req.body.user;
      const campaign: CreateCampaignDTO = req.body.campaign;

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
        message: error.message || "Campaign hasn't been created.",
      });
    }
  }

  async createData(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
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
      const user: UserToken = req.body.user;
      delete req.body.user;
      const placeholder_data: CreateCampaignDataDTO = req.body.campaign;

      const sectionId = Object.keys(placeholder_data.data)[0];
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

      const allSlugs = Object.values(Object.values(placeholder_data.data)[0]);
      const generateSlugs = () => {
        const _slugs = {};
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

      await prisma.campaign.update({
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
                ...(placeholder_data.data as JsonObject),
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
      });
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message || "Campaign data hasn't been created.",
      });
    }
  }

  async deleteData(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
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
      const user: UserToken = req.body.user;
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
        message: error.message || "Campaign hasn't been deleted.",
      });
    }
  }

  async delete(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
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
      const user: UserToken = req.body.user;
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
        message: error.message || "Campaign hasn't been deleted.",
      });
    }
  }

  async update(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({
          status: "error",
          message: "Validation error",
          ...errors,
        });
      }

      const user: UserToken = req.body.user;
      const campaign: UpdateCampaignDTO = req.body.campaign;
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
      if (error instanceof PrismaClientValidationError) {
        return res.status(400).send({
          status: "error",
          message: error.message,
        });
      }
      res.status(400).send({
        status: "error",
        message: error.message || "Campaign hasn't been updated.",
      });
    }
  }

  async getAll(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    try {
      const user: UserToken = req.body.user;
      const campaigns = await prisma.campaign.findMany({
        where: {
          userId:
            user.role === "GUEST"
              ? "07fde4aa-1377-44db-853e-df3561429d9b"
              : user.id,
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
        message: error.message || "Something went wrong",
      });
    }
  }

  async getOne(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
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
          userId:
            user.role === "GUEST"
              ? "07fde4aa-1377-44db-853e-df3561429d9b"
              : user.id,
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
        message: error.message || "Something went wrong",
      });
    }
  }
}
