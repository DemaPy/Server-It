import jwt, { TokenExpiredError } from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    if (!("authorization" in req.headers)) {
      throw new Error("Token not found.");
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Token not found.");
    }

    const decodeData = jwt.verify(token, "MY_SUPER_SECRET_KEY");
    req.body.user = decodeData;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res
      .status(401)
      .json({ status: "error", message: "Token expired." });
    }
    
    return res
      .status(403)
      .json({ status: "error", message: error.message });
  }
};
