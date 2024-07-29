"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateController = void 0;
var db_1 = require("../../db");
var library_1 = require("@prisma/client/runtime/library");
var express_validator_1 = require("express-validator");
var TemplateController = /** @class */ (function () {
    function TemplateController() {
    }
    TemplateController.prototype.getAll = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, isManager, templates, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        user = req.body.user;
                        isManager = user.role === "PROJECT_MANAGER";
                        templates = void 0;
                        if (!isManager) return [3 /*break*/, 2];
                        return [4 /*yield*/, db_1.prisma.template.findMany()];
                    case 1:
                        templates = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, db_1.prisma.template.findMany({
                            where: {
                                userId: user.id,
                            },
                        })];
                    case 3:
                        templates = _a.sent();
                        _a.label = 4;
                    case 4:
                        res.send({
                            status: "success",
                            message: "Templates found",
                            data: templates,
                        });
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        res.status(400).send({
                            status: "error",
                            message: error_1.message || "Something went wrong",
                        });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    TemplateController.prototype.getOne = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, id, user, template, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).send(__assign({ status: "error", message: "Validation errorsss" }, errors))];
                        }
                        id = req.params.id;
                        user = req.body.user;
                        return [4 /*yield*/, db_1.prisma.template.findUnique({
                                where: {
                                    id: id,
                                    userId: user.role === "GUEST"
                                        ? "07fde4aa-1377-44db-853e-df3561429d9b"
                                        : user.id,
                                },
                                include: {
                                    sections: {
                                        orderBy: {
                                            order: "asc",
                                        },
                                        include: {
                                            placeholders: true,
                                        },
                                    },
                                },
                            })];
                    case 1:
                        template = _a.sent();
                        res.send({
                            status: "success",
                            message: "Template has been found.",
                            data: template,
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        res.status(400).send({
                            status: "error",
                            message: error_2.message || "Something went wrong",
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TemplateController.prototype.create = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, user, template, createdTemplate, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).send(__assign({ status: "error", message: "Validation error" }, errors))];
                        }
                        user = req.body.user;
                        template = req.body.template;
                        return [4 /*yield*/, db_1.prisma.template.create({
                                data: {
                                    title: template.title,
                                    userId: user.id,
                                },
                            })];
                    case 1:
                        createdTemplate = _a.sent();
                        res.send({
                            status: "success",
                            message: "Template has been created.",
                            data: { id: createdTemplate.id },
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.log(error_3);
                        if (error_3 instanceof library_1.PrismaClientKnownRequestError) {
                            return [2 /*return*/, res.status(400).send({
                                    status: "error",
                                    message: "Database write error",
                                })];
                        }
                        res.status(400).send({
                            status: "error",
                            message: error_3.message || "Template hasn't been created.",
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TemplateController.prototype.update = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, user, template, isExist, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).send(__assign({ status: "error", message: "Validation error" }, errors))];
                        }
                        user = req.body.user;
                        template = req.body.template;
                        return [4 /*yield*/, db_1.prisma.template.findMany({
                                where: {
                                    id: template.id,
                                    userId: user.id,
                                },
                            })];
                    case 1:
                        isExist = _a.sent();
                        if (!isExist) {
                            throw new Error("Template doesn't exist.");
                        }
                        return [4 /*yield*/, db_1.prisma.template.update({
                                where: {
                                    id: template.id,
                                    userId: user.id,
                                },
                                data: {
                                    title: template.title,
                                },
                            })];
                    case 2:
                        _a.sent();
                        res.send({
                            status: "success",
                            message: "Template has been updated.",
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        res.status(400).send({
                            status: "error",
                            message: error_4.message || "Template hasn't been updated.",
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TemplateController.prototype.delete = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, id, user, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).send(__assign({ status: "error", message: "Validation error" }, errors))];
                        }
                        id = req.params.id;
                        user = req.body.user;
                        return [4 /*yield*/, db_1.prisma.template.delete({
                                where: {
                                    id: id,
                                    userId: user.id,
                                },
                            })];
                    case 1:
                        _a.sent();
                        res.send({
                            status: "success",
                            message: "Template has been deleted.",
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        res.status(400).send({
                            status: "error",
                            message: error_5.message || "Template hasn't been deleted.",
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return TemplateController;
}());
exports.TemplateController = TemplateController;
