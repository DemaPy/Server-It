"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
var express_1 = require("express");
var controller_1 = require("../../entities/user/controller");
var express_validator_1 = require("express-validator");
exports.userRouter = (0, express_1.Router)();
var Controller = new controller_1.UserController();
exports.userRouter.get("/", Controller.getAllUsers);
exports.userRouter.get("/:id", [(0, express_validator_1.param)("id", "").exists().isString().notEmpty()], Controller.getById);