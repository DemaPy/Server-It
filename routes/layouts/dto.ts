import { Layout } from "@prisma/client";

export class UpdateLayoutDTO {
  id: Layout["id"];
  is_active: Layout["is_active"];
  renderOn: Layout["renderOn"];
  constructor(data: any) {
    this.id = data.id;
    this.is_active = data.is_active;
    this.renderOn = data.renderOn;
  }
}

export class UpdateLayoutsOrderDTO {
  layout: Layout[] = []
  constructor(data: any) {
    for (const layout of data.layout) {
      this.layout.push({
        id: layout.id,
        campaignId: layout.campaignId,
        is_active: layout.is_active,
        order: layout.order,
        renderOn: layout.renderOn,
        sectionId: layout.sectionId
      })
    }
    
  }
}