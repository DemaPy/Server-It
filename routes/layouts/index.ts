import { NextFunction, Router } from "express";
import { Request, Response } from "express";
import { prisma } from "../../db";
import { layoutDTO } from "../../middlewares/DTOS/layoutDTO";
import { UpdateLayoutDTO, UpdateLayoutsOrderDTO } from "./dto";
import { check, validationResult } from "express-validator";
import { MIDDLEWARES } from "../../middlewares/guard";

export const layoutRouter = Router();

layoutRouter.patch(
  "/",
  MIDDLEWARES.user,
  layoutDTO(UpdateLayoutDTO),
  async (req: Request, res: Response, next: NextFunction) => {
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
      next(error);
    }
  }
);

layoutRouter.patch(
  "/order",
  MIDDLEWARES.user,
  [
    check("layout", "Layouts is not valid.").exists().isArray({
      min: 1,
    }),
  ],
  layoutDTO(UpdateLayoutsOrderDTO),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors);
      }
      const layout: UpdateLayoutsOrderDTO = req.body.layout;

      const campaign = await prisma.campaign.findUnique({
        where: {
          id: layout.layout[0].campaignId,
        },
        include: {
          template: {
            select: {
              sections: {
                include: {
                  placeholders: true,
                },
              },
            },
          },
        },
      });
      if (!campaign) {
        throw new Error("Campaign is not found");
      }

      for (const item of layout.layout) {
        await prisma.layout.update({
          where: {
            id: item.id,
          },
          data: item,
        });
      }

      res.send({
        status: "success",
        message: "Layout has been updated.",
        data: {
          ...campaign,
          layout: layout.layout,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

layoutRouter.delete(
  "/:id",
  MIDDLEWARES.user,
  async (req: Request, res: Response, next: NextFunction) => {
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
      next(error);
    }
  }
);
