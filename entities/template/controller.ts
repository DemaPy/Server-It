import { Request, Response } from "express";
import { prisma } from "../../db";
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { validationResult } from "express-validator";
import {
  CreateTemplateDTO,
  UpdateTemplateDTO,
} from "../../routes/templates/dto";
import { Controller } from "../type";

export class TemplateController implements Controller {
  async getAll(req: Request, res: Response) {
    try {
      const user = req.body.user;
      const templates = await prisma.template.findMany({
        where: {
          userId: user.id,
        },
      });
      res.send({
        status: "success",
        message: "",
        data: templates,
      });
    } catch (error) {
      res.send({
        status: "error",
        message: "Something went wrong",
        error: error,
        data: null,
      });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const template = await prisma.template.findUnique({
        where: {
          id: id,
        },
        include: {
          sections: {
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
      res.send({
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
        return res.status(400).json(errors);
      }

      const user: Omit<User, "password"> = req.body.user;
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
        return res.send({
          status: "error",
          message: "Database write error",
          data: req.body.template,
        });
      }
      res.send({
        status: "error",
        message: "Template hasn't been created." + error.message,
        data: req.body.template,
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const template: UpdateTemplateDTO = req.body.template;
      const updatedTemplate = await prisma.template.update({
        where: {
          id: template.id,
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
      res.send({
        status: "error",
        message: "Template hasn't been updated.",
        data: req.body.template,
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deletedTemplate = await prisma.template.delete({
        where: {
          id: id,
        },
      });
      res.send({
        status: "success",
        message: "Template has been deleted.",
        data: deletedTemplate,
      });
    } catch (error) {
      res.send({
        status: "error",
        message: "Template hasn't been deleted.",
        data: { id: req.params.id },
      });
    }
  }
}