import { Router } from "express";
import { Request, Response } from "express";
import { prisma } from "../../db";
import { sectionDTO } from "../../middlewares/DTOS/sectionDTO";
import { ComponentPlaceholder, Section } from "@prisma/client";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";

export const sectionRouter = Router();

// sectionRouter.get("/", async (req: Request, res: Response) => {
//   try {
//     const sections = await prisma.section.findMany();
//     res.send({
//       status: "success",
//       message: "",
//       data: sections,
//     });
//   } catch (error) {
//     res.send({
//       status: "error",
//       message: "Something went wrong",
//       error: error,
//       data: null,
//     });
//   }
// });

// sectionRouter.get("/:id", async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const section = await prisma.section.findUnique({
//       where: {
//         id: id,
//       },
//     });
//     res.send({
//       status: "success",
//       message: "",
//       data: section,
//     });
//   } catch (error) {
//     res.send({
//       status: "error",
//       message: "Something went wrong",
//       data: null,
//     });
//   }
// });

sectionRouter.post("/:id", sectionDTO, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sectionToDuplicate = await prisma.section.findUnique({
      where: {
        id: id,
      },
      include: {
        placeholders: true,
      },
    });

    if (!sectionToDuplicate) {
      throw new Error("Section not found.");
    }

    const template = await prisma.template.findUnique({
      where: {
        id: sectionToDuplicate.templateId,
      },
      include: {
        sections: true,
      },
    });
    if (!template) {
      throw new Error("Template not found.");
    }

    const createdSection = await prisma.section.create({
      data: {
        title: sectionToDuplicate.title + " copy",
        content: sectionToDuplicate.content,
        templateId: sectionToDuplicate.templateId,
      },
    });
    if (sectionToDuplicate.placeholders) {
      await prisma.sectionPlaceholder.createMany({
        data: sectionToDuplicate.placeholders,
      });
    }

    const campaigns = await prisma.campaign.findMany({
      where: {
        templateId: template.id,
      },
      include: {
        layout: true,
      },
    });
    if (campaigns.length > 0) {
      const updatedLayouts = campaigns.map((item) => {
        return {
          sectionId: createdSection.id,
          order: item.layout.length,
          campaignId: item.id,
          is_active: true,
          renderOn: {},
        };
      });

      await prisma.layout.createMany({
        data: updatedLayouts,
      });
    }

    res.send({
      status: "success",
      message: "Section has been duplicated.",
      data: createdSection,
    });
  } catch (error) {
    res.send({
      status: "error",
      message: "Section hasn't been duplicated.",
      data: req.params,
    });
  }
});

// TESTED
sectionRouter.post("/", sectionDTO, async (req: Request, res: Response) => {
  try {
    const section: Omit<Section, "id"> = req.body.section;
    const placeholders: ComponentPlaceholder[] = req.body.placeholders;
    const template = await prisma.template.findUnique({
      where: {
        id: section.templateId,
      },
      include: {
        sections: true,
      },
    });
    if (!template) {
      throw new Error("Template not found.");
    }

    let createdSection;
    if (placeholders) {
      createdSection = await prisma.section.create({
        data: {
          title: section.title,
          content: section.content,
          templateId: section.templateId,
          placeholders: {
            createMany: {
              data: placeholders.map((item) => ({
                fallback: item.fallback,
                position: item.position,
                title: item.title,
              })),
            },
          },
        },
      });
    } else {
      createdSection = await prisma.section.create({
        data: {
          title: section.title,
          content: section.content,
          templateId: section.templateId,
        },
      });
    }

    res.send({
      status: "success",
      message: "Section has been created.",
      data: createdSection,
    });
  } catch (error) {
    console.log(error);

    if (error instanceof PrismaClientValidationError) {
      return res.send({
        status: "error",
        message: "Bad request entity",
        data: req.body.section,
        error: error.message,
      });
    }
    res.send({
      status: "error",
      message: "Section hasn't been created.",
      data: req.body.section,
      error: error.message,
    });
  }
});

sectionRouter.patch("/", sectionDTO, async (req: Request, res: Response) => {
  try {
    const section: Section = req.body.section;
    const updatedSection = await prisma.section.update({
      where: {
        id: section.id,
      },
      data: {
        title: section.title,
        content: section.content,
      },
    });
    res.send({
      status: "success",
      message: "Section has been updated.",
      data: updatedSection,
    });
  } catch (error) {
    res.send({
      status: "error",
      message: "Section hasn't been updated.",
      data: req.body.section,
    });
  }
});

sectionRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedSection = await prisma.section.delete({
      where: {
        id: id,
      },
    });
    res.send({
      status: "success",
      message: "Section has been deleted.",
      data: deletedSection,
    });
  } catch (error) {
    res.send({
      status: "error",
      message: "Section hasn't been deleted.",
      data: { id: req.params.id },
    });
  }
});
