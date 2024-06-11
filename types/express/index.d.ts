import { Component, Section, Template, User } from "@prisma/client";
import express from "express";

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
