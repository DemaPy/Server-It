import { Router } from "express";
import { Request, Response } from "express";
import { prisma } from "../../db";
import { SectionPlaceholder } from "@prisma/client";
import { placeholderDTO } from "../../middlewares/DTOS/placeholderSectionsDTO";
import { MIDDLEWARES } from "../../middlewares/guard";
import { UserToken } from "../../entities/auth/controller";

export const sectionPlaceholderRouter = Router();

sectionPlaceholderRouter.post(
  "/",
  MIDDLEWARES.user,
  placeholderDTO,
  async (req: Request, res: Response) => {
    try {
      const user: UserToken = req.body.user;
      const placeholder: Omit<SectionPlaceholder, "id"> = req.body.placeholder;

      const section = await prisma.section.findUnique({
        where: {
          id: placeholder.sectionId,
        },
      });
      if (!section) {
        throw new Error("Section not found.");
      }

      let isPlaceholderWithTheSamePositionExist = false;
      const placeholders = await prisma.sectionPlaceholder.findMany({
        where: {
          sectionId: placeholder.sectionId,
        },
      });
      placeholders.forEach((item) => {
        if (placeholder.position === item.position) {
          isPlaceholderWithTheSamePositionExist = true;
        }
      });

      if (isPlaceholderWithTheSamePositionExist) {
        throw new Error("Placeholder for this position already exist.");
      }

      const createdPlaceholder = await prisma.sectionPlaceholder.create({
        data: placeholder,
      });
      res.send({
        status: "success",
        message: "Placeholder has been created.",
        data: createdPlaceholder,
      });
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: "Placeholder hasn't been created.",
        data: req.body.placeholder,
        error: error.message,
      });
    }
  }
);

sectionPlaceholderRouter.patch(
  "/",
  MIDDLEWARES.user,
  placeholderDTO,
  async (req: Request, res: Response) => {
    try {
      const placeholder: SectionPlaceholder = req.body.placeholder;
      const updatedPlaceholder = await prisma.sectionPlaceholder.update({
        where: {
          id: placeholder.id,
        },
        data: {
          title: placeholder.title,
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
        message: "Placeholder hasn't been updated.",
        data: req.body.placeholder,
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
      const deletedPlaceholder = await prisma.sectionPlaceholder.delete({
        where: {
          id: id,
        },
      });
      res.send({
        status: "success",
        message: "Placeholder has been deleted.",
        data: deletedPlaceholder,
      });
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: "Placeholder hasn't been deleted.",
      });
    }
  }
);
