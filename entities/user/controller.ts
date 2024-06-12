import { prisma } from "../../db";

export class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await prisma.user.findMany();
      return res.json(users);
    } catch (error) {
      return res
        .status(400)
        .json({ error: "An error occurred", message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const params = req.params;
      if (!("id" in params)) {
        throw new Error("Validation error");
      }

      const {password, ...rest} = await prisma.user.findUnique({
        where: {
          id: params.id,
        },
      });
      return res.status(200).json({ status: "success", data: rest });
    } catch (error) {
      return res
        .status(400)
        .json({ error: "An error occurred", message: error.message });
    }
  }
}