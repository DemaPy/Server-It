import { Router } from "express";
import { Request, Response } from "express";
import { prisma } from "../../db";
import { placeholderDTO } from "../../middlewares/DTOS/placeholdersComponentDTO";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { MIDDLEWARES } from "../../middlewares/guard";
import {
  CreateComponentPlaceholderDTO,
  UpdateComponentPlaceholderDTO,
} from "./dto";
import { decode, encode } from "html-entities";
import jsdom from "jsdom";
import { ComponentPlaceholderValidation } from "./validation";
import { validationResult } from "express-validator";

export const componentPlaceholdersRouter = Router();
const Validation = new ComponentPlaceholderValidation();

componentPlaceholdersRouter.post(
  "/",
  MIDDLEWARES.user,
  Validation.create(),
  placeholderDTO(CreateComponentPlaceholderDTO),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({
          status: "error",
          message: "Validation error",
          ...errors,
        });
      }

      const {
        placeholders,
        componentId,
        content,
      }: CreateComponentPlaceholderDTO = req.body.placeholder;
      const component = await prisma.component.findUnique({
        where: {
          id: componentId,
        },
      });
      if (!component) {
        throw new Error("Component not found.");
      }

      prisma.$transaction([
        prisma.component.update({
          where: {
            id: componentId,
          },
          data: {
            content: content,
          },
        }),
        prisma.componentPlaceholder.createMany({
          data: placeholders,
        }),
      ]);

      res.send({
        status: "success",
        message: "Placeholders has been created.",
      });
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message || "Placeholders hasn't been created.",
      });
    }
  }
);

componentPlaceholdersRouter.patch(
  "/",
  MIDDLEWARES.user,
  placeholderDTO(UpdateComponentPlaceholderDTO),
  async (req: Request, res: Response) => {
    try {
      const placeholder: UpdateComponentPlaceholderDTO = req.body.placeholder;
      const toUpdate = await prisma.componentPlaceholder.findUnique({
        where: {
          id: placeholder.id,
        },
      });

      if (!toUpdate) {
        throw new Error("Placeholder to update not found");
      }

      const updatedPlaceholder = await prisma.componentPlaceholder.update({
        where: {
          id: placeholder.id,
        },
        data: {
          title: placeholder.title,
          fallback: placeholder.fallback,
        },
      });
      res.send({
        status: "success",
        message: "Placeholder has been updated.",
      });
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: "Placeholder hasn't been updated.",
      });
    }
  }
);

componentPlaceholdersRouter.delete(
  "/:id",
  MIDDLEWARES.user,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const placeholder = await prisma.componentPlaceholder.findUnique({
        where: {
          id: id,
        },
      });
      if (!placeholder) {
        throw new Error("Placeholder doesn't exist.");
      }

      const component = await prisma.component.findUnique({
        where: {
          id: placeholder.componentId,
        },
      });
      const dom = new jsdom.JSDOM(component.content);
      const body = dom.window.document.body;

      console.log(component);
      
      const placeholder_to_delete = body.querySelector(
        `[data-template-it_id='${placeholder.id}']`
      );
      placeholder_to_delete.remove();
      const new_content = body.innerHTML;

      await prisma.component.update({
        where: {
          id: component.id,
        },
        data: {
          content: decode(new_content),
        },
      });

      await prisma.componentPlaceholder.delete({
        where: {
          id: placeholder.id,
        },
      });
      res.send({
        status: "success",
        message: "Placeholder has been deleted.",
      });
    } catch (error) {
      console.log(error);

      if (error instanceof PrismaClientKnownRequestError) {
        return res.send({
          status: "error",
          message: error.meta.cause,
        });
      }

      res.status(400).send({
        status: "error",
        message: "Placeholder hasn't been deleted.",
      });
    }
  }
);
