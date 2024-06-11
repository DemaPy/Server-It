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
import { layoutDTO } from "../../middlewares/DTOS/layoutDTO";
import { Layout } from "@prisma/client";

export const layoutRouter = Router();

// layoutRouter.get("/", async (req: Request, res: Response) => {
//   try {
//     const layouts = await prisma.layout.findMany();
//     res.send({
//       status: "success",
//       message: "",
//       data: layouts,
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

// layoutRouter.get("/:id", async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const layout = await prisma.layout.findUnique({
//       where: {
//         id: id,
//       },
//     });
//     res.send({
//       status: "success",
//       message: layout === null ? "Layout not found" : "Layout found",
//       data: layout,
//     });
//   } catch (error) {
//     res.send({
//       status: "error",
//       message: "Something went wrong",
//       data: null,
//     });
//   }
// });

layoutRouter.patch("/", layoutDTO, async (req: Request, res: Response) => {
  try {
    const layout: Layout = req.body.layout;
    const updatedLayout = await prisma.layout.update({
      where: {
        id: layout.id,
      },
      data: {
        is_active: layout.is_active,
        order: layout.order,
        renderOn: layout.renderOn,
      },
    });
    res.send({
      status: "success",
      message: "Layout has been updated.",
      data: updatedLayout,
    });
  } catch (error) {
    res.send({
      status: "error",
      message: "Layout hasn't been updated.",
      data: req.body,
    });
  }
});

layoutRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedLayout = await prisma.layout.delete({
      where: {
        id: id,
      },
    });
    res.send({
      status: "success",
      message: "Layout has been deleted.",
      data: deletedLayout,
    });
  } catch (error) {
    res.send({
      status: "error",
      message: "Layout hasn't been deleted.",
      data: { id: req.params.id },
    });
  }
});
