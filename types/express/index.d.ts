import { Component, Section, Template, User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user: User;
      template: Template;
      component: Component;
      section: Section;
    }
  }
}
