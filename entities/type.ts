import { Template } from "@prisma/client";
import { Request, Response } from "express";

export interface Controller {
    getOne: (req: Request, res: Response) => void
    getAll: (req: Request, res: Response) => void
    create: (req: Request, res: Response) => void
    update: (req: Request, res: Response) => void
    delete: (req: Request, res: Response) => void
}