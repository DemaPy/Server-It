import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { Controller } from "../type";
import { prisma } from "../../db";
import { User } from "@prisma/client";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { validationResult } from "express-validator";
import {
  CreateSectionDTO,
  CreateSectionFromComponentDTO,
  UpdateSectionDTO,
} from "../../routes/sections/dto";
import { isTemplateExist } from "../../utils/helper";
import { v4 as uuidv4 } from "uuid";
import * as jsdom from "jsdom";

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

      const isSectionExist = await prisma.section.findUnique({
        where: {
          id: id,
        },
      });
      if (!isSectionExist) {
        throw new Error("Section not found.");
      }

      const campaigns = await prisma.campaign.findMany({
        where: {
          templateId: {
            equals: isSectionExist.templateId,
          },
        },
      });

      const toUpdate = [];
      if (campaigns) {
        const newCampaigns = campaigns.map((campaign) => {
          delete campaign.data[isSectionExist.id];
          return campaign;
        });
        for (const item of newCampaigns) {
          toUpdate.push({ where: { id: item.id }, data: item });
        }
      }

      await prisma.$transaction([
        ...toUpdate.map((item) => prisma.campaign.update(item)),
        prisma.section.delete({
          where: {
            id: id,
          },
        }),
      ]);

      res.send({
        status: "success",
        message: "Section has been deleted.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        status: "error",
        message: error.message || "Section has not been deleted.",
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

      const template = await isTemplateExist({
        templatId: section.templateId,
        userId: user.id,
        include: {
          sections: true,
        },
      });

      let createdSection = await prisma.section.create({
        data: {
          title: section.title,
          content: section.content,
          placeholders: {
            createMany: {
              data: section.placeholders,
            },
          },
          templateId: section.templateId,
          order:
            template.sections.length <= 1
              ? template.sections.length
              : template.sections.length - 1,
        },
      });

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
        message: error.message || "Section hasn't been created.",
      });
    }
  }

  async createFromComponent(
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
      const section: CreateSectionFromComponentDTO = req.body.section;

      const template = await isTemplateExist({
        templatId: section.templateId,
        userId: user.id,
        include: {
          sections: true,
        },
      });

      const component = await prisma.component.findUnique({
        where: {
          id: section.componentId,
          userId: user.id,
        },
        include: {
          placeholders: true,
        },
      });
      if (!component) {
        throw new Error("Component doesn't exist.");
      }

      // generate placeholders with new id,
      // update placeholder id in content
      const dom = new jsdom.JSDOM(component.content);
      const body = dom.window.document.body;

      const section_placeholders = component.placeholders.map((item) => {
        const id = uuidv4();
        const placeholder_to_change = body.querySelector(
          `[data-template-it_id='${item.id}']`
        );
        placeholder_to_change.setAttribute("data-template-it_id", id);
        return {
          id: id,
          fallback: item.fallback,
          title: item.title,
        };
      });
      const new_content = body.innerHTML;

      let createdSection = await prisma.section.create({
        data: {
          title: "Copied: " + component.title,
          content: new_content,
          templateId: section.templateId,
          order:
            template.sections.length <= 1
              ? template.sections.length
              : template.sections.length - 1,
          placeholders: {
            createMany: {
              data: section_placeholders,
            },
          },
        },
      });

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
          message: error.message || "Section hasn't been created.",
        });
      }
      res.status(400).send({
        status: "error",
        message: error.message || "Section hasn't been created.",
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
      const { id } = req.params;
      const section = await prisma.section.findUnique({
        where: {
          id: id,
        },
        include: {
          placeholders: true,
        },
      });
      res.send({
        status: "success",
        message:
          section === null ? `Section ${id} not found` : `Section ${id} found`,
        data: section,
      });
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message || "Something went wrong",
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
      const user: User = req.body.user;
      const section: UpdateSectionDTO = req.body.section;

      await isTemplateExist({
        templatId: section.templateId,
        userId: user.id,
      });

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
      await prisma.section.update({
        where: {
          id: isSectionExist.id,
        },
        data: {
          title: section.title,
          content: section.content,
          placeholders: {
            deleteMany: {
              id: {
                in: section.placeholdersToDelete.map((item) => item.id),
              },
            },
            createMany: {
              data: section.placeholdersToCreate,
            },
          },
        },
        include: {
          placeholders: true,
        },
      });

      res.send({
        status: "success",
        message: "Section has been updated.",
      });
    } catch (error) {
      console.log(error);

      res.status(400).send({
        status: "error",
        message: error.message || "Section hasn't been updated.",
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

      // Create layout for all campaigns that use this template
      const campaigns = await prisma.campaign.findMany({
        where: {
          templateId: template.id,
        },
        include: {
          layout: true,
        },
      });

      // generate placeholders with new id,
      // update placeholder id in content
      const dom = new jsdom.JSDOM(sectionToDuplicate.content);
      const body = dom.window.document.body;

      const section_placeholders = sectionToDuplicate.placeholders.map(
        (item) => {
          const id = uuidv4();
          const placeholder_to_change = body.querySelector(
            `[data-template-it_id='${item.id}']`
          );
          placeholder_to_change.setAttribute("data-template-it_id", id);
          return {
            id: id,
            fallback: item.fallback,
            title: item.title,
          };
        }
      );
      const new_content = body.innerHTML;

      await prisma.section.create({
        data: {
          title: sectionToDuplicate.title + " copy",
          content: new_content,
          templateId: sectionToDuplicate.templateId,
          Layout: {
            createMany: {
              data: campaigns.map((item) => {
                return {
                  order: item.layout.length,
                  campaignId: item.id,
                  is_active: true,
                  renderOn: {},
                };
              }),
            },
          },
          placeholders: {
            createMany: {
              data: section_placeholders,
            },
          },
          order: template.sections.length,
        },
      });

      res.send({
        status: "success",
        message: "Section has been duplicated.",
      });
    } catch (error) {
      console.log(error);
      if (error instanceof PrismaClientKnownRequestError) {
        return res.status(400).send({
          status: "error",
          message: error.meta.cause || "Section has not been duplicated.",
        });
      }

      res.status(400).send({
        status: "error",
        message: error.message || "Section has not been duplicated.",
      });
    }
  }
}
