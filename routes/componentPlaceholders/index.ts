import { Router } from "express";
import { Request, Response } from "express";
import { prisma } from "../../db";
import { ComponentPlaceholder } from "@prisma/client";
import { placeholderDTO } from "../../middlewares/DTOS/placeholdersComponentDTO";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { MIDDLEWARES } from "../../middlewares/guard";

export const componentPlaceholdersRouter = Router();

componentPlaceholdersRouter.post(
  "/",
  MIDDLEWARES.user,
  placeholderDTO,
  async (req: Request, res: Response) => {
    try {
      const placeholder: Omit<ComponentPlaceholder, "id"> =
        req.body.placeholder;

      const component = await prisma.component.findUnique({
        where: {
          id: placeholder.componentId,
        },
      });
      if (!component) {
        throw new Error("Component not found.");
      }

      let isPlaceholderWithTheSamePositionExist = false;
      const placeholders = await prisma.componentPlaceholder.findMany({
        where: {
          componentId: placeholder.componentId,
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

      const createdPlaceholder = await prisma.componentPlaceholder.create({
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
        error: error.message,
        data: req.body.placeholder,
      });
    }
  }
);

componentPlaceholdersRouter.patch(
  "/",
  MIDDLEWARES.user,
  placeholderDTO,
  async (req: Request, res: Response) => {
    try {
      const placeholder: ComponentPlaceholder = req.body.placeholder;
      const updatedPlaceholder = await prisma.componentPlaceholder.update({
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

      await prisma.componentPlaceholder.delete({
        where: {
          id: placeholder.id,
        },
      });

      const component = await prisma.component.findUnique({
        where: {
          id: placeholder.componentId,
        },
      });
      res.send({
        status: "success",
        message: "Placeholder has been deleted.",
        data: component,
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
