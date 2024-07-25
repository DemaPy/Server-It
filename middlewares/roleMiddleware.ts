import { Role, User } from "@prisma/client";
import * as jwt from "jsonwebtoken";

export const roleMiddleware = (roles: Role[]) => (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error();
    }
    const decodeData = jwt.verify(token, "MY_SUPER_SECRET_KEY") as Pick<
      User,
      "role" | "id"
    >;

    let hasAccess = false;
    roles.forEach((role) => {
      if (role === decodeData.role) {
        hasAccess = true;
      }
    });
    if (hasAccess) {
      req.body.user = decodeData;
      next();
    } else {
      throw new Error("Ooops, looks like you don't have access.");
    }
  } catch (error) {
    return res
      .status(403)
      .json({ status: "error", message: error.message || "Access denied." });
  }
};
