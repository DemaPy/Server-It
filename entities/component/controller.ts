import { prisma } from "../../db";
import { Request, Response } from "express";
import { Controller } from "../type";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import {
  CreateComponentDTO,
  UpdateComponentDTO,
} from "../../routes/components/dto";

export class ComponentController implements Controller {
  async getAll(req: Request, res: Response) {
    try {
      const components = await prisma.component.findMany({
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
      res.send({
        status: "error",
        message: "Something went wrong",
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
      const { id } = req.params;
      const component = await prisma.component.findUnique({
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
          component === null
            ? `Component ${id} not found`
            : `Component ${id} found`,
        data: component,
      });
    } catch (error) {
      res.send({
        status: "error",
        message: "Something went wrong",
        data: null,
      });
    }
  }

  async create(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    try {
      const component: CreateComponentDTO = req.body.component;
      const createdComponent = await prisma.component.create({
        data: {
          title: component.title,
          content: component.content,
        },
      });
      res.send({
        status: "success",
        message: "Component has been created.",
        data: createdComponent,
      });
    } catch (error) {
      res.send({
        status: "error",
        message: "Component hasn't been created.",
        data: req.body.component,
      });
    }
  }

  async update(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    try {
      const component: UpdateComponentDTO = req.body.component;
      const updatedComponent = await prisma.component.update({
        where: {
          id: component.id,
        },
        data: {
          title: component.title,
          content: component.content,
        },
      });
      res.send({
        status: "success",
        message: "Component has been updated.",
        data: updatedComponent,
      });
    } catch (error) {
      res.send({
        status: "error",
        message: "Component hasn't been updated.",
      });
    }
  }

  async delete(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    try {
      const { id } = req.params;
      const deletedComponent = await prisma.component.delete({
        where: {
          id: id,
        },
      });
      res.send({
        status: "success",
        message: "Component has been deleted.",
        data: deletedComponent,
      });
    } catch (error) {
      res.send({
        status: "error",
        message: "Component hasn't been deleted.",
        data: { id: req.params.id },
      });
    }
  }
}
