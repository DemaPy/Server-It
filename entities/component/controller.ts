import { prisma } from "../../db";
import { NextFunction, Request, Response } from "express";
import { Controller } from "../type";
import {
  CreateComponentDTO,
  UpdateComponentDTO,
} from "../../routes/components/dto";
import { validationResult } from "express-validator";
import { User } from "@prisma/client";

export class ComponentController implements Controller {
  async getAll(req: Request, res: Response, next: NextFunction) {
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
      next(error);
    }
  }

  async getOne(
    req: Request,
    res: Response<any, Record<string, any>>,
    next: NextFunction
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
      next(error);
    }
  }

  async create(
    req: Request,
    res: Response<any, Record<string, any>>,
    next: NextFunction
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
      next(error);
    }
  }

  async update(
    req: Request,
    res: Response<any, Record<string, any>>,
    next: NextFunction
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
          id: component.id,
        },
        data: {
          title: component.title,
          content: component.content,
        },
        include: {
          placeholders: true,
        },
      });

      for (const placeholder of component.placeholders) {
        await prisma.componentPlaceholder.update({
          where: {
            id: placeholder.id,
          },
          data: placeholder,
        });
      }

      res.send({
        status: "success",
        message: "Component has been updated.",
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(
    req: Request,
    res: Response<any, Record<string, any>>,
    next: NextFunction
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
      next(error);
    }
  }
}
