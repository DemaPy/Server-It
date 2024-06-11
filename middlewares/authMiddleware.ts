import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Access denied");
    }

    const decodeData = jwt.verify(token, "MY_SUPER_SECRET_KEY");
    req.body.user = decodeData;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res
      .status(401)
      .json({ status: "error",  error: error, message: "Token expired.", code: 401 });
    }
    console.log(error);
    
    return res
      .status(403)
      .json({ status: "error",  error: error, message: "Access denied.", code: 403 });
  }
};
