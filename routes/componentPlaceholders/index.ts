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

export const componentPlaceholdersRouter = Router();

componentPlaceholdersRouter.post(
  "/",
  MIDDLEWARES.user,
  placeholderDTO(CreateComponentPlaceholderDTO),
  async (req: Request, res: Response) => {
    try {
      const { placeholders }: CreateComponentPlaceholderDTO =
        req.body.placeholder;
      const component = await prisma.component.findUnique({
        where: {
          id: placeholders[0].componentId,
        },
      });
      if (!component) {
        throw new Error("Component not found.");
      }

      const count = await prisma.componentPlaceholder.createMany({
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
