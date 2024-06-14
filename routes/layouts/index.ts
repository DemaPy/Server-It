import { Router } from "express";
import { Request, Response } from "express";
import { prisma } from "../../db";
import { layoutDTO } from "../../middlewares/DTOS/layoutDTO";
import { Layout } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { UpdateLayoutDTO, UpdateLayoutsOrderDTO } from "./dto";
import { check, validationResult } from "express-validator";

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

layoutRouter.patch(
  "/",
  layoutDTO(UpdateLayoutDTO),
  async (req: Request, res: Response) => {
    try {
      const layout: UpdateLayoutDTO = req.body.layout;

      const layoutIsExist = await prisma.layout.findUnique({
        where: {
          id: layout.id,
        },
      });
      if (!layoutIsExist) {
        throw new Error("Layout doesn't exist.");
      }

      const updatedLayout = await prisma.layout.update({
        where: {
          id: layout.id,
        },
        data: {
          is_active: layout.is_active,
          renderOn: layout.renderOn,
        },
      });
      res.send({
        status: "success",
        message: "Layout has been updated.",
        data: updatedLayout,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        res.status(422).send({
          status: "error",
          message: error.meta.cause,
        });
        return;
      }

      res.status(400).send({
        status: "error",
        message: error.message,
      });
    }
  }
);

layoutRouter.patch(
  "/order",
  [
    check("layouts", "Layouts is not valid.").exists().isArray({
      min: 2,
      max: 2,
    }),
  ],
  layoutDTO(UpdateLayoutsOrderDTO),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors);
      }
      const { layouts }: UpdateLayoutsOrderDTO = req.body.layout;

      const firstLayout: Layout = layouts[0];
      const secondLayout: Layout = layouts[1];

      const campaign = await prisma.campaign.findUnique({
        where: {
          id: firstLayout.campaignId,
        },
        include: {
          layout: true,
        },
      });

      if (
        campaign.layout.length < firstLayout.order ||
        campaign.layout.length - firstLayout.order < 0
      ) {
        throw new Error("Order 1 layout is not valid");
      }

      if (
        campaign.layout.length < secondLayout.order ||
        campaign.layout.length - secondLayout.order < 0
      ) {
        throw new Error("Order 2 layout is not valid");
      }

      const isOrderForTheSecondItemIsFromFirstItem =
        await prisma.layout.findFirst({
          where: {
            order: {
              equals: secondLayout.order,
            },
          },
        });

      const isOrderForTheFirstItemIsFromSecondItem =
        await prisma.layout.findFirst({
          where: {
            order: {
              equals: firstLayout.order,
            },
          },
        });

      if (isOrderForTheSecondItemIsFromFirstItem.id !== firstLayout.id) {
        throw new Error("What are you doing???");
      }

      if (isOrderForTheSecondItemIsFromFirstItem.id !== firstLayout.id) {
        throw new Error("What are you doing???");
      }

      if (isOrderForTheFirstItemIsFromSecondItem.id !== secondLayout.id) {
        throw new Error("What are you doing???");
      }

      if (isOrderForTheFirstItemIsFromSecondItem.id !== secondLayout.id) {
        throw new Error("What are you doing???");
      }

      const layoutIsExist1 = await prisma.layout.findUnique({
        where: {
          id: firstLayout.id,
        },
      });

      const layoutIsExist2 = await prisma.layout.findUnique({
        where: {
          id: secondLayout.id,
        },
      });
      if (!layoutIsExist1 || !layoutIsExist2) {
        throw new Error("Layout doesn't exist.");
      }

      await prisma.layout.update({
        where: {
          id: firstLayout.id,
        },
        data: {
          order: firstLayout.order,
        },
      });
      await prisma.layout.update({
        where: {
          id: secondLayout.id,
        },
        data: {
          order: secondLayout.order,
        },
      });
      res.send({
        status: "success",
        message: "Layout has been updated.",
        data: campaign,
      });
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        res.status(400).send({
          status: "error",
          message: error.message,
        });
      }

      if (error instanceof PrismaClientKnownRequestError) {
        res.status(422).send({
          status: "error",
          message: error.meta.cause,
        });
        return;
      }

      res.status(400).send({
        status: "error",
        message: error.meta.cause,
      });
    }
  }
);

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
    res.status(400).send({
      status: "error",
      message: "Layout hasn't been deleted.",
      data: { id: req.params.id },
    });
  }
});
