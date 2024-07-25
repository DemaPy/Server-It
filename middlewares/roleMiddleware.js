"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = void 0;
var jwt = require("jsonwebtoken");
var roleMiddleware = function (roles) { return function (req, res, next) {
    if (req.method === "OPTIONS") {
        next();
    }
    try {
        var token = req.headers.authorization.split(" ")[1];
        if (!token) {
            throw new Error();
        }
        var decodeData_1 = jwt.verify(token, "MY_SUPER_SECRET_KEY");
        var hasAccess_1 = false;
        roles.forEach(function (role) {
            if (role === decodeData_1.role) {
                hasAccess_1 = true;
            }
        });
        if (hasAccess_1) {
            req.body.user = decodeData_1;
            next();
        }
        else {
            throw new Error("Ooops, looks like you don't have access.");
        }
    }
    catch (error) {
        return res
            .status(403)
            .json({ status: "error", message: error.message || "Access denied." });
    }
}; };
exports.roleMiddleware = roleMiddleware;
