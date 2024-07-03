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
      const templates = await prisma.template.findMany({
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
        data: templates,
      });
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: "Something went wrong",
        error: error,
        data: null,
      });
    }
  }

  async getOne(req: Request, res: Response) {
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
              order: "asc"
            },
            include: {
              placeholders: true,
            },
          },
        },
      });
      res.send({
        status: "success",
        message: "",
        data: template,
      });
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: "Something went wrong",
        data: null,
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
        data: createdTemplate,
      });
    } catch (error) {
      console.log(error);
      if (error instanceof PrismaClientKnownRequestError) {
        return res.status(400).send({
          status: "error",
          message: "Database write error",
          data: req.body.template,
        });
      }
      res.status(400).send({
        status: "error",
        message: "Template hasn't been created." + error.message,
        data: req.body.template,
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

      const updatedTemplate = await prisma.template.update({
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
        data: updatedTemplate,
      });
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: "Template hasn't been updated.",
        data: req.body.template,
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

      const deletedTemplate = await prisma.template.delete({
        where: {
          id: id,
          userId: user.id
        },
      });
      res.send({
        status: "success",
        message: "Template has been deleted.",
        data: deletedTemplate,
      });
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: "Template hasn't been deleted.",
        data: { id: req.params.id },
      });
    }
  }
}
