"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MIDDLEWARES = void 0;
var authMiddleware_1 = require("./authMiddleware");
var roleMiddleware_1 = require("./roleMiddleware");
exports.MIDDLEWARES = {
    admin: [authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(["DEVELOPER", "ADMIN"])],
    private: [
        authMiddleware_1.authMiddleware,
        (0, roleMiddleware_1.roleMiddleware)(["DEVELOPER", "ADMIN", "PROJECT_MANAGER"]),
    ],
    user: [
        authMiddleware_1.authMiddleware,
        (0, roleMiddleware_1.roleMiddleware)(["DEVELOPER", "ADMIN", "PROJECT_MANAGER", "USER"]),
    ],
    guest: [
        authMiddleware_1.authMiddleware,
        (0, roleMiddleware_1.roleMiddleware)(["DEVELOPER", "ADMIN", "PROJECT_MANAGER", "USER", "GUEST"]),
    ],
};
