"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sectionRouter = void 0;
var express_1 = require("express");
var sectionDTO_1 = require("../../middlewares/DTOS/sectionDTO");
var validation_1 = require("./validation");
var controller_1 = require("../../entities/section/controller");
var dto_1 = require("./dto");
var guard_1 = require("../../middlewares/guard");
exports.sectionRouter = (0, express_1.Router)();
var Controller = new controller_1.SectionController();
var Validation = new validation_1.SectionValidation();
exports.sectionRouter.get("/:id", guard_1.MIDDLEWARES.guest, Validation.get(), Controller.getOne);
exports.sectionRouter.post("/", guard_1.MIDDLEWARES.user, Validation.create(), (0, sectionDTO_1.sectionDTO)(dto_1.CreateSectionDTO), Controller.create);
exports.sectionRouter.post("/component", guard_1.MIDDLEWARES.user, Validation.createFromComponent(), (0, sectionDTO_1.sectionDTO)(dto_1.CreateSectionFromComponentDTO), Controller.createFromComponent);
exports.sectionRouter.post("/:id", guard_1.MIDDLEWARES.user, Validation.duplicate(), Controller.duplicate);
exports.sectionRouter.patch("/", guard_1.MIDDLEWARES.user, Validation.update(), (0, sectionDTO_1.sectionDTO)(dto_1.UpdateSectionDTO), Controller.update);
exports.sectionRouter.delete("/:id", guard_1.MIDDLEWARES.user, Validation.delete(), Controller.delete);
