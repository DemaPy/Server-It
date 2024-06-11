import { Layout, Prisma } from "@prisma/client";

export class LayoutDTO {
  static extractFields(layout: any): Layout | Error {
    if (!layout || Array.isArray(layout)) {
      throw Error("Layout not found");
    }
    try {
      const DTO: Layout = {
        id: layout.id,
        is_active: layout.is_active,
        order: layout.order,
        renderOn: layout.renderOn,
        sectionId: layout.sectionId,
        campaignId: layout.campaignId,
      };
      return DTO;
    } catch (error) {
      throw error;
    }
  }
}
