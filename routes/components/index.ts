import { Router } from "express";
import { Request, Response } from "express";
import { prisma } from "../../db";
import { componentDTO } from "../../middlewares/DTOS/componentDTO";
import { Component } from "@prisma/client";

export const componentRouter = Router();

componentRouter.get("/", async (req: Request, res: Response) => {
  try {
    const components = await prisma.component.findMany();
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
});

componentRouter.get("/:id", async (req: Request, res: Response) => {
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
      message: component === null ? "Component not found" : "Component found",
      data: component,
    });
  } catch (error) {
    res.send({
      status: "error",
      message: "Something went wrong",
      data: null,
    });
  }
});

componentRouter.post("/", componentDTO, async (req: Request, res: Response) => {
  try {
    const component: Component = req.body.component;
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
      data: req.body,
    });
  }
});

componentRouter.patch(
  "/",
  componentDTO,
  async (req: Request, res: Response) => {
    try {
      const component: Component = req.body.component;
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
        data: req.body,
      });
    }
  }
);

componentRouter.delete("/:id", async (req: Request, res: Response) => {
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
});
