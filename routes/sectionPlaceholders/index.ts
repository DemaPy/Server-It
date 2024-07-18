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
import { decode, encode } from "html-entities";
import jsdom from "jsdom";

export const sectionPlaceholderRouter = Router();

sectionPlaceholderRouter.post(
  "/",
  MIDDLEWARES.user,
  placeholderDTO(CreateSectionPlaceholderDTO),
  async (req: Request, res: Response) => {
    try {
      const user: UserToken = req.body.user;
      const { placeholders }: CreateSectionPlaceholderDTO =
        req.body.placeholder;

      const section = await prisma.section.findUnique({
        where: {
          id: placeholders[0].sectionId,
        },
      });
      if (!section) {
        throw new Error("Section not found.");
      }

      const count = await prisma.sectionPlaceholder.createMany({
        data: placeholders,
      });
      res.send({
        status: "success",
        message: "Placeholders has been created.",
        data: placeholders,
      });
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: "Placeholders hasn't been created.",
        error: error.message,
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
        data: updatedPlaceholder,
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
      const new_content = body.innerHTML

      await prisma.section.update({
        where: {
          id: section.id,
        },
        data: {
          content: decode(new_content),
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
