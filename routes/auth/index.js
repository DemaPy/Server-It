"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
var express_1 = require("express");
var controller_1 = require("../../entities/auth/controller");
var express_validator_1 = require("express-validator");
exports.authRouter = (0, express_1.Router)();
var Controller = new controller_1.AuthController();
exports.authRouter.post("/login", [
    (0, express_validator_1.check)("email", "Email is not valid.").exists().notEmpty().isEmail(),
    (0, express_validator_1.check)("password", "Password is not valid.").exists().notEmpty().isLength({
        min: 4,
        max: 20,
    }),
], Controller.login);
// authRouter.post(
//   "/registration",
//   [
//     check("email", "Email is not valid").notEmpty().isEmail(),
//     check("password", "Password is not valid.").notEmpty().isLength({
//       min: 4,
//       max: 10,
//     }),
//   ],
//   Controller.registration
// );
