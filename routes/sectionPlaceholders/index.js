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
exports.sectionPlaceholderRouter = void 0;
var express_1 = require("express");
var db_1 = require("../../db");
var placeholderSectionsDTO_1 = require("../../middlewares/DTOS/placeholderSectionsDTO");
var guard_1 = require("../../middlewares/guard");
var dto_1 = require("./dto");
var jsdom = require("jsdom");
var validation_1 = require("./validation");
var express_validator_1 = require("express-validator");
var library_1 = require("@prisma/client/runtime/library");
exports.sectionPlaceholderRouter = (0, express_1.Router)();
var Validation = new validation_1.SectionPlaceholderValidation();
exports.sectionPlaceholderRouter.post("/", guard_1.MIDDLEWARES.user, Validation.create(), (0, placeholderSectionsDTO_1.placeholderDTO)(dto_1.CreateSectionPlaceholderDTO), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, user, _a, placeholders, sectionId, content, section, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).send(__assign({ status: "error", message: "Validation error" }, errors))];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                user = req.body.user;
                _a = req.body.placeholder, placeholders = _a.placeholders, sectionId = _a.sectionId, content = _a.content;
                return [4 /*yield*/, db_1.prisma.section.findUnique({
                        where: {
                            id: sectionId,
                        },
                    })];
            case 2:
                section = _b.sent();
                if (!section) {
                    throw new Error("Section not found.");
                }
                db_1.prisma.$transaction([
                    db_1.prisma.section.update({
                        where: {
                            id: sectionId,
                        },
                        data: {
                            content: content,
                        },
                    }),
                    db_1.prisma.sectionPlaceholder.createMany({
                        data: placeholders,
                    }),
                ]);
                res.send({
                    status: "success",
                    message: "Placeholders has been created.",
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                if (error_1 instanceof library_1.PrismaClientKnownRequestError) {
                    res.status(400).send({
                        status: "error",
                        message: error_1.message || "DB error happend",
                    });
                }
                res.status(400).send({
                    status: "error",
                    message: "Placeholders hasn't been created.",
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.sectionPlaceholderRouter.patch("/", guard_1.MIDDLEWARES.user, (0, placeholderSectionsDTO_1.placeholderDTO)(dto_1.UpdateSectionPlaceholderDTO), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var placeholder, toUpdate, updatedPlaceholder, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                placeholder = req.body.placeholder;
                return [4 /*yield*/, db_1.prisma.sectionPlaceholder.findUnique({
                        where: {
                            id: placeholder.id,
                        },
                    })];
            case 1:
                toUpdate = _a.sent();
                if (!toUpdate) {
                    throw new Error("Placeholder to update not found");
                }
                return [4 /*yield*/, db_1.prisma.sectionPlaceholder.update({
                        where: {
                            id: placeholder.id,
                        },
                        data: {
                            title: placeholder.title,
                            fallback: placeholder.fallback,
                        },
                    })];
            case 2:
                updatedPlaceholder = _a.sent();
                res.send({
                    status: "success",
                    message: "Placeholder has been updated.",
                });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                res.status(400).send({
                    status: "error",
                    message: (error_2 === null || error_2 === void 0 ? void 0 : error_2.message) || "Placeholder hasn't been updated.",
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.sectionPlaceholderRouter.delete("/:id", guard_1.MIDDLEWARES.user, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, placeholder, section, dom, body, placeholder_to_delete, new_content, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                id = req.params.id;
                return [4 /*yield*/, db_1.prisma.sectionPlaceholder.findUnique({
                        where: {
                            id: id,
                        },
                    })];
            case 1:
                placeholder = _a.sent();
                if (!placeholder) {
                    throw new Error("Placeholder doesn't exist.");
                }
                return [4 /*yield*/, db_1.prisma.section.findUnique({
                        where: {
                            id: placeholder.sectionId,
                        },
                    })];
            case 2:
                section = _a.sent();
                dom = new jsdom.JSDOM(section.content);
                body = dom.window.document.body;
                placeholder_to_delete = body.querySelector("[data-template-it_id='".concat(placeholder.id, "']"));
                placeholder_to_delete.remove();
                new_content = body.innerHTML;
                return [4 /*yield*/, db_1.prisma.section.update({
                        where: {
                            id: section.id,
                        },
                        data: {
                            content: new_content,
                        },
                    })];
            case 3:
                _a.sent();
                return [4 /*yield*/, db_1.prisma.sectionPlaceholder.delete({
                        where: {
                            id: id,
                        },
                    })];
            case 4:
                _a.sent();
                res.send({
                    status: "success",
                    message: "Placeholder has been deleted.",
                });
                return [3 /*break*/, 6];
            case 5:
                error_3 = _a.sent();
                res.status(400).send({
                    status: "error",
                    message: "Placeholder hasn't been deleted.",
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
