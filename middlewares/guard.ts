import { authMiddleware } from "./authMiddleware";
import { roleMiddleware } from "./roleMiddleware";

export const MIDDLEWARES = {
  admin: [authMiddleware, roleMiddleware(["DEVELOPER", "ADMIN"])],
  private: [
    authMiddleware,
    roleMiddleware(["DEVELOPER", "ADMIN", "PROJECT_MANAGER"]),
  ],
  user: [
    authMiddleware,
    roleMiddleware(["DEVELOPER", "ADMIN", "PROJECT_MANAGER", "USER"]),
  ],
  guest: [
    authMiddleware,
    roleMiddleware(["DEVELOPER", "ADMIN", "PROJECT_MANAGER", "USER", "GUEST"]),
  ],
};
