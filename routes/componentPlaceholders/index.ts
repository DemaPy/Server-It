// var json = [
//     { name: 'Bob the dog' },
//     { name: 'Claudine the cat' },
//   ] as Prisma.JsonArray

//   const createUser = await prisma.user.create({
//     data: {
//       email: 'birgitte@prisma.io',
//       extendedPetsData: json,
//     },
//   })
// https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-json-fields

import { Router } from "express";
import { Request, Response } from "express";
import { prisma } from "../../db";
import { ComponentPlaceholder } from "@prisma/client";
import { placeholderDTO } from "../../middlewares/DTOS/placeholdersComponentDTO";

export const componentPlaceholdersRouter = Router();

// placeholderRouter.get("/", async (req: Request, res: Response) => {
//   try {
//     const campaigns = await prisma.placeholder.findMany();
//     res.send({
//       status: "success",
//       message: "",
//       data: campaigns,
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

// placeholderRouter.get("/:id", async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const campaign = await prisma.placeholder.findUnique({
//       where: {
//         id: id,
//       },
//     });
//     res.send({
//       status: "success",
//       message: campaign === null ? "Placeholder not found" : "Placeholder found",
//       data: campaign,
//     });
//   } catch (error) {
//     res.send({
//       status: "error",
//       message: "Something went wrong",
//       data: null,
//     });
//   }
// });

// TODO: sectionId placeholderId
// TESTED
componentPlaceholdersRouter.post(
  "/",
  placeholderDTO,
  async (req: Request, res: Response) => {
    try {
      const placeholder: Omit<ComponentPlaceholder, "id"> = req.body.placeholder

      const component = await prisma.component.findUnique({
        where: {
          id: placeholder.componentId,
        },
      });
      if (!component) {
        throw new Error("Component not found.");
      }

      const createdPlaceholder = await prisma.componentPlaceholder.create({
        data: placeholder
      })

      console.log({component, placeholder, createdPlaceholder});

      res.send({
        status: "success",
        message: "Placeholder has been created.",
        data: createdPlaceholder,
      });
    } catch (error) {
      res.send({
        status: "error",
        message: "Placeholder hasn't been created.",
        error: error.message,
        data: req.body.placeholder
      });
    }
  }
);

componentPlaceholdersRouter.patch(
  "/",
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
      res.send({
        status: "error",
        message: "Placeholder hasn't been updated.",
        data: req.body.placeholder
      });
    }
  }
);

componentPlaceholdersRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCampaign = await prisma.sectionPlaceholder.delete({
      where: {
        id: id,
      },
    });
    res.send({
      status: "success",
      message: "Campaign has been deleted.",
      data: deletedCampaign,
    });
  } catch (error) {
    res.send({
      status: "error",
      message: "Campaign hasn't been deleted.",
      data: { id: req.params.id },
    });
  }
});
