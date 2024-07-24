import { prisma } from "../../db";
import { Request, Response } from "express";
import { Controller } from "../type";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import {
  CreateComponentDTO,
  UpdateComponentDTO,
} from "../../routes/components/dto";
import { validationResult } from "express-validator";
import { User } from "@prisma/client";

export class ComponentController implements Controller {
  async getAll(req: Request, res: Response) {
    try {
      const user: User = req.body.user;
      const components = await prisma.component.findMany({
        where: {
          userId: user.id,
        },
        include: {
          placeholders: true,
        },
      });
      res.send({
        status: "success",
        message: "",
        data: components,
      });
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message || "Something went wrong",
        error: error,
        data: null,
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

      const user: User = req.body.user;
      const { id } = req.params;
      const component = await prisma.component.findUnique({
        where: {
          id: id,
          userId: user.id,
        },
        include: {
          placeholders: true,
        },
      });
      res.send({
        status: "success",
        message:
          component === null
            ? `Component ${id} not found`
            : `Component ${id} found`,
        data: component,
      });
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message || "Something went wrong",
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
      const component: CreateComponentDTO = req.body.component;
      let createdComponent = await prisma.component.create({
        data: {
          title: component.title,
          content: component.content,
          placeholders: {
            createMany: { data: component.placeholders },
          },
          userId: user.id,
        },
      });

      res.send({
        status: "success",
        message: "Component has been created.",
        data: createdComponent,
      });
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message || "Component hasn't been created.",
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
      const component: UpdateComponentDTO = req.body.component;

      const isComponentExist = await prisma.component.findUnique({
        where: {
          id: component.id,
          userId: user.id,
        },
        include: {
          placeholders: true,
        },
      });
      if (!isComponentExist) {
        throw new Error("Component not found.");
      }

      await prisma.component.update({
        where: {
          id: isComponentExist.id,
        },
        data: {
          title: component.title,
          content: component.content,
          placeholders: {
            deleteMany: {
              id: {
                in: component.placeholdersToDelete.map((item) => item.id),
              },
            },
            createMany: {
              data: component.placeholdersToCreate,
            },
          },
        },
        include: {
          placeholders: true,
        },
      });

      res.send({
        status: "success",
        message: "Component has been updated.",
      });
    } catch (error) {
      console.log(error);

      res.status(400).send({
        status: "error",
        message: error.message || "Component has not been updated.",
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
      const user: User = req.body.user;
      const deletedComponent = await prisma.component.delete({
        where: {
          id: id,
          userId: user.id,
        },
      });
      res.send({
        status: "success",
        message: "Component has been deleted.",
        data: deletedComponent,
      });
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message || "Component hasn't been deleted.",
      });
    }
  }
}
