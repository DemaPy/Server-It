import { Router } from "express";
import { Request, Response } from "express";
import { prisma } from "../../db";
import { placeholderDTO } from "../../middlewares/DTOS/placeholderSectionsDTO";
import { MIDDLEWARES } from "../../middlewares/guard";
import { UserToken } from "../../entities/auth/controller";
import {
  CreateSectionPlaceholderDTO,
  UpdateSectionPlaceholderDTO,
} from "./dto";
import { decode } from "html-entities";
import * as jsdom from "jsdom";
import { SectionPlaceholderValidation } from "./validation";
import { validationResult } from "express-validator";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const sectionPlaceholderRouter = Router();
const Validation = new SectionPlaceholderValidation();

sectionPlaceholderRouter.post(
  "/",
  MIDDLEWARES.user,
  Validation.create(),
  placeholderDTO(CreateSectionPlaceholderDTO),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        status: "error",
        message: "Validation error",
        ...errors,
      });
    }
    try {
      const user: UserToken = req.body.user;
      const { placeholders, sectionId, content }: CreateSectionPlaceholderDTO =
        req.body.placeholder;

      const section = await prisma.section.findUnique({
        where: {
          id: sectionId,
        },
      });
      if (!section) {
        throw new Error("Section not found.");
      }

      prisma.$transaction([
        prisma.section.update({
          where: {
            id: sectionId,
          },
          data: {
            content: content,
          },
        }),
        prisma.sectionPlaceholder.createMany({
          data: placeholders,
        }),
      ]);

      res.send({
        status: "success",
        message: "Placeholders has been created.",
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        res.status(400).send({
          status: "error",
          message: error.message || "DB error happend",
        });
      }

      res.status(400).send({
        status: "error",
        message: "Placeholders hasn't been created.",
      });
    }
  }
);

sectionPlaceholderRouter.patch(
  "/",
  MIDDLEWARES.user,
  placeholderDTO(UpdateSectionPlaceholderDTO),
  async (req: Request, res: Response) => {
    try {
      const placeholder: UpdateSectionPlaceholderDTO = req.body.placeholder;
      const toUpdate = await prisma.sectionPlaceholder.findUnique({
        where: {
          id: placeholder.id,
        },
      });

      if (!toUpdate) {
        throw new Error("Placeholder to update not found");
      }

      const updatedPlaceholder = await prisma.sectionPlaceholder.update({
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
        message: error?.message || "Placeholder hasn't been updated.",
      });
    }
  }
);

sectionPlaceholderRouter.delete(
  "/:id",
  MIDDLEWARES.user,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const placeholder = await prisma.sectionPlaceholder.findUnique({
        where: {
          id: id,
        },
      });
      if (!placeholder) {
        throw new Error("Placeholder doesn't exist.");
      }

      const section = await prisma.section.findUnique({
        where: {
          id: placeholder.sectionId,
        },
      });

      const dom = new jsdom.JSDOM(section.content);
      const body = dom.window.document.body;

      const placeholder_to_delete = body.querySelector(
        `[data-template-it_id='${placeholder.id}']`
      );
      placeholder_to_delete.remove();
      const new_content = body.innerHTML;

      await prisma.section.update({
        where: {
          id: section.id,
        },
        data: {
          content: new_content,
        },
      });

      await prisma.sectionPlaceholder.delete({
        where: {
          id: id,
        },
      });

      res.send({
        status: "success",
        message: "Placeholder has been deleted.",
      });
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: "Placeholder hasn't been deleted.",
      });
    }
  }
);
