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
import { Prisma, User } from "@prisma/client";
import jsdom from "jsdom";
import { decode, encode } from "html-entities";

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
          content: encode(component.content),
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

      const dom = new jsdom.JSDOM(component.content);
      const body = dom.window.document.body;
      // Itarate through all placeholders and insert ID instead of span node
      isComponentExist.placeholders.map(item => {
        const placeholder_to_delete = body.querySelector(
          `[data-template-it_id='${item.id}']`
        );
        placeholder_to_delete.insertAdjacentHTML("beforebegin", item.id)
        placeholder_to_delete.remove()
      })
      // Overwrite body content with encoded html
      let encoded_html = encode(body.innerHTML)
      // Itarate through all placeholders and insert span instead of id
      isComponentExist.placeholders.map(item => {
        encoded_html = encoded_html.replace(item.id, `<span style='cursor: pointer; padding: 0.2rem 0.4rem; border-radius: 0.2rem; background: rgba(9, 92, 236, 0.39); font-size: 14px; box-shadow: rgba(0, 0, 0, 0.376) 0px 0px 5px;' data-template-it_id='${item.id}'>${item.title}</span>`)
      })

      await prisma.$transaction([
        // prisma.componentPlaceholder.deleteMany({
        //   where: {
        //     id: {
        //       in: isComponentExist.placeholders.map((item) => item.id),
        //     },
        //   },
        // }),

        prisma.component.update({
          where: {
            id: isComponentExist.id,
            userId: user.id,
          },
          data: {
            title: component.title,
            content: encoded_html,
          },
        }),
      ]);

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
