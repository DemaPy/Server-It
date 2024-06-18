import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { Controller } from "../type";
import { prisma } from "../../db";
import { ComponentPlaceholder, Section, User } from "@prisma/client";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { validationResult } from "express-validator";
import { CreateSectionDTO, UpdateSectionDTO } from "../../routes/sections/dto";

export class SectionController implements Controller {
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
      const user: User = req.body.user;

      const templates = await prisma.template.findMany({
        where: {
          userId: user.id,
        },
        include: {
          sections: true,
        },
      });
      let isHaveAccessToDelete = false;
      templates.forEach((item) => {
        for (const section of item.sections) {
          if (section.id === id) {
            isHaveAccessToDelete = true;
          }
        }
      });
      if (!isHaveAccessToDelete) {
        throw new Error("Section you are trying to delete doesn't exist.");
      }

      const deletedSection = await prisma.section.delete({
        where: {
          id: id,
        },
      });

      const campaigns = await prisma.campaign.findMany({
        where: {
          templateId: {
            equals: deletedSection.templateId,
          },
        },
      });

      if (campaigns) {
        const newCampaigns = campaigns.map((campaign) => {
          delete campaign.data[deletedSection.id];
          return campaign;
        });
        for (const item of newCampaigns) {
          await prisma.campaign.update({ where: { id: item.id }, data: item });
        }
      }

      res.send({
        status: "success",
        message: "Section has been deleted.",
        data: deletedSection,
      });
    } catch (error) {
      console.log(error);

      res.status(400).send({
        status: "error",
        message: error.message,
        data: { id: req.params.id },
      });
    }
  }

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

      const user: User = req.body.user;
      const section: CreateSectionDTO = req.body.section;
      const placeholders: ComponentPlaceholder[] = req.body.placeholders;
      const template = await prisma.template.findUnique({
        where: {
          id: section.templateId,
          userId: user.id,
        },
      });
      if (!template) {
        throw new Error("Template doesn't exist for this section.");
      }

      let createdSection;
      if (placeholders) {
        createdSection = await prisma.section.create({
          data: {
            title: section.title,
            content: section.content,
            templateId: section.templateId,
            placeholders: {
              createMany: {
                data: placeholders.map((item) => ({
                  fallback: item.fallback,
                  position: item.position,
                  title: item.title,
                })),
              },
            },
          },
        });
      } else {
        createdSection = await prisma.section.create({
          data: {
            title: section.title,
            content: section.content,
            templateId: section.templateId,
          },
        });
      }

      const campaigns = await prisma.campaign.findMany({
        where: {
          templateId: template.id,
        },
        include: {
          layout: true,
        },
      });
      if (campaigns.length > 0) {
        const updatedLayouts = campaigns.map((item) => {
          return {
            sectionId: createdSection.id,
            order: item.layout.length,
            campaignId: item.id,
            is_active: true,
            renderOn: {},
          };
        });

        await prisma.layout.createMany({
          data: updatedLayouts,
        });
      }

      res.send({
        status: "success",
        message: "Section has been created.",
        data: createdSection,
      });
    } catch (error) {
      console.log(error);

      if (error instanceof PrismaClientValidationError) {
        return res.status(400).send({
          status: "error",
          message: error.message,
        });
      }
      res.status(400).send({
        status: "error",
        message: "Section hasn't been created.",
        data: req.body.section,
        error: error.message,
      });
    }
  }

  async getAll(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {}

  async getOne(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {}

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
      const user: User = req.body.user;
      const section: UpdateSectionDTO = req.body.section;

      const template = await prisma.template.findMany({
        where: {
          id: section.templateId,
          userId: user.id,
        },
      });
      if (!template) {
        throw new Error("Template doesn't exist for this section.");
      }

      const isSectionExist = await prisma.section.findUnique({
        where: {
          id: section.id,
        },
        include: {
          placeholders: true,
        },
      });
      if (!isSectionExist) {
        throw new Error("Section not found.");
      }

      const shifting = section.content.length - isSectionExist.content.length;
      if (Math.abs(shifting) > 0) {
        for (const item of isSectionExist.placeholders) {
          await prisma.sectionPlaceholder.delete({
            where: {
              id: item.id,
            },
          });
        }
        const campaigns = await prisma.campaign.findMany({
          where: {
            templateId: {
              equals: section.templateId,
            },
          },
        });
  
        if (campaigns) {

          const newCampaigns = campaigns.map((campaign) => {
            for (const item of isSectionExist.placeholders) {
              delete campaign.data[section.id][item.id]
            }
            return campaign;
          });
          for (const campaign of newCampaigns) {
            await prisma.campaign.update({ where: { id: campaign.id }, data: campaign });
          }
        }
      }

      const updatedSection = await prisma.section.update({
        where: {
          id: section.id,
        },
        data: {
          title: section.title,
          content: section.content,
        },
        include: {
          placeholders: true,
        },
      });
      res.send({
        status: "success",
        message: "Section has been updated.",
        data: updatedSection,
      });
    } catch (error) {
      console.log(error);

      res.status(400).send({
        status: "error",
        message: "Section hasn't been updated.",
        data: req.body.section,
      });
    }
  }

  async duplicate(
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
      const user: User = req.body.user;

      const templates = await prisma.template.findMany({
        where: {
          userId: user.id,
        },
        include: {
          sections: true,
        },
      });
      let isHaveAccessToDuplicate = false;
      templates.forEach((item) => {
        for (const section of item.sections) {
          if (section.id === id) {
            isHaveAccessToDuplicate = true;
          }
        }
      });
      if (!isHaveAccessToDuplicate) {
        throw new Error(
          "Section you are trying to duplicate doesn't exist for this template."
        );
      }

      const sectionToDuplicate = await prisma.section.findUnique({
        where: {
          id: id,
        },
        include: {
          placeholders: true,
        },
      });

      if (!sectionToDuplicate) {
        throw new Error("Section not found.");
      }

      const template = await prisma.template.findUnique({
        where: {
          id: sectionToDuplicate.templateId,
        },
        include: {
          sections: true,
        },
      });
      if (!template) {
        throw new Error("Template not found.");
      }

      const createdSection = await prisma.section.create({
        data: {
          title: sectionToDuplicate.title + " copy",
          content: sectionToDuplicate.content,
          templateId: sectionToDuplicate.templateId,
        },
      });
      if (sectionToDuplicate.placeholders) {
        await prisma.sectionPlaceholder.createMany({
          data: sectionToDuplicate.placeholders,
        });
      }

      // Create layout for all campaigns that use this template
      const campaigns = await prisma.campaign.findMany({
        where: {
          templateId: template.id,
        },
        include: {
          layout: true,
        },
      });
      if (campaigns.length > 0) {
        const updatedLayouts = campaigns.map((item) => {
          return {
            sectionId: createdSection.id,
            order: item.layout.length,
            campaignId: item.id,
            is_active: true,
            renderOn: {},
          };
        });

        await prisma.layout.createMany({
          data: updatedLayouts,
        });
      }

      res.send({
        status: "success",
        message: "Section has been duplicated.",
        data: createdSection,
      });
    } catch (error) {
      console.log(error);
      if (error instanceof PrismaClientKnownRequestError) {
        return res.status(400).send({
          status: "error",
          message: error.meta.cause,
        });
      }

      res.status(400).send({
        status: "error",
        message: error.message,
        data: req.params,
      });
    }
  }
}
