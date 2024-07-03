import { Router } from "express";
import { Request, Response } from "express";
import { prisma } from "../../db";
import { SectionPlaceholder } from "@prisma/client";
import { placeholderDTO } from "../../middlewares/DTOS/placeholderSectionsDTO";
import { MIDDLEWARES } from "../../middlewares/guard";
import { UserToken } from "../../entities/auth/controller";
import { CreateSectionPlaceholderDTO, UpdateSectionPlaceholderDTO } from "./dto";

export const sectionPlaceholderRouter = Router();

sectionPlaceholderRouter.post(
  "/",
  MIDDLEWARES.user,
  placeholderDTO(CreateSectionPlaceholderDTO),
  async (req: Request, res: Response) => {
    try {
      const user: UserToken = req.body.user;
      const {placeholders}: CreateSectionPlaceholderDTO = req.body.placeholder;

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
