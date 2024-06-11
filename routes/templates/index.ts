import { Router } from "express";
import { Request, Response } from "express";
import { templateDTO } from "../../middlewares/DTOS/templateDTO";
import { prisma } from "../../db";
import { Template, User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const templateRouter = Router();

templateRouter.get("/", async (req: Request, res: Response) => {
  try {
    const user = req.body.user;
    const templates = await prisma.template.findMany({
      where: {
        userId: user.id,
      },
    });
    res.send({
      status: "success",
      message: "",
      data: templates,
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

templateRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const template = await prisma.template.findUnique({
      where: {
        id: id,
      },
      include: {
        sections: {
          include: {
            placeholders: true,
          },
        },
      },
    });
    res.send({
      status: "success",
      message: "",
      data: template,
    });
  } catch (error) {
    res.send({
      status: "error",
      message: "Something went wrong",
      data: null,
    });
  }
});

templateRouter.post("/", templateDTO, async (req: Request, res: Response) => {
  try {
    const user: User = req.body.user;
    const template: Omit<Template, "id"> = req.body.template;
    const createdTemplate = await prisma.template.create({
      data: {
        title: template.title,
        userId: user.id,
      },
    });
    res.send({
      status: "success",
      message: "Template has been created.",
      data: createdTemplate,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientKnownRequestError) {
      return res.send({
        status: "error",
        message: "Database write error",
        data: req.body.template,
      });
    }
    res.send({
      status: "error",
      message: "Template hasn't been created." + error.message,
      data: req.body.template,
    });
  }
});

templateRouter.patch("/", templateDTO, async (req: Request, res: Response) => {
  try {
    const template: Template = req.body.template;
    const updatedTemplate = await prisma.template.update({
      where: {
        id: template.id,
      },
      data: {
        title: template.title,
      },
    });
    res.send({
      status: "success",
      message: "Template has been updated.",
      data: updatedTemplate,
    });
  } catch (error) {
    res.send({
      status: "error",
      message: "Template hasn't been updated.",
      data: req.body.template,
    });
  }
});

templateRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedTemplate = await prisma.template.delete({
      where: {
        id: id,
      },
    });
    res.send({
      status: "success",
      message: "Template has been deleted.",
      data: deletedTemplate,
    });
  } catch (error) {
    res.send({
      status: "error",
      message: "Template hasn't been deleted.",
      data: { id: req.params.id },
    });
  }
});
