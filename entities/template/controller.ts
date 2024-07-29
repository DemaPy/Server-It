import { Request, Response } from "express";
import { prisma } from "../../db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { validationResult } from "express-validator";
import {
  CreateTemplateDTO,
  UpdateTemplateDTO,
} from "../../routes/templates/dto";
import { Controller } from "../type";
import { UserToken } from "../auth/controller";

export class TemplateController implements Controller {
  async getAll(req: Request, res: Response) {
    try {
      const user: UserToken = req.body.user;
      const isManager = user.role === "PROJECT_MANAGER";
      let templates;
      if (isManager) {
        templates = await prisma.template.findMany();
      } else {
        templates = await prisma.template.findMany({
          where: {
            userId: user.id,
          },
        });
      }
      res.send({
        status: "success",
        message: "Templates found",
        data: templates,
      });
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message || "Something went wrong",
      });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({
          status: "error",
          message: "Validation errorsss",
          ...errors,
        });
      }
      const { id } = req.params;
      const user: UserToken = req.body.user;
      const template = await prisma.template.findUnique({
        where: {
          id: id,
          userId:
            user.role === "GUEST"
              ? "07fde4aa-1377-44db-853e-df3561429d9b"
              : user.id,
        },
        include: {
          sections: {
            orderBy: {
              order: "asc",
            },
            include: {
              placeholders: true,
            },
          },
        },
      });
      res.send({
        status: "success",
        message: "Template has been found.",
        data: template,
      });
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message || "Something went wrong",
      });
    }
  }

  async create(req: Request, res: Response) {
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
      const template: CreateTemplateDTO = req.body.template;
      const createdTemplate = await prisma.template.create({
        data: {
          title: template.title,
          userId: user.id,
        },
      });
      res.send({
        status: "success",
        message: "Template has been created.",
        data: { id: createdTemplate.id },
      });
    } catch (error) {
      console.log(error);
      if (error instanceof PrismaClientKnownRequestError) {
        return res.status(400).send({
          status: "error",
          message: "Database write error",
        });
      }
      res.status(400).send({
        status: "error",
        message: error.message || "Template hasn't been created.",
      });
    }
  }

  async update(req: Request, res: Response) {
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
      const template: UpdateTemplateDTO = req.body.template;

      const isExist = await prisma.template.findMany({
        where: {
          id: template.id,
          userId: user.id,
        },
      });
      if (!isExist) {
        throw new Error("Template doesn't exist.");
      }

      await prisma.template.update({
        where: {
          id: template.id,
          userId: user.id,
        },
        data: {
          title: template.title,
        },
      });
      res.send({
        status: "success",
        message: "Template has been updated.",
      });
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message || "Template hasn't been updated.",
      });
    }
  }

  async delete(req: Request, res: Response) {
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

      await prisma.template.delete({
        where: {
          id: id,
          userId: user.id,
        },
      });
      res.send({
        status: "success",
        message: "Template has been deleted.",
      });
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message || "Template hasn't been deleted.",
      });
    }
  }
}
