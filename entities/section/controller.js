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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionController = void 0;
var db_1 = require("../../db");
var library_1 = require("@prisma/client/runtime/library");
var express_validator_1 = require("express-validator");
var helper_1 = require("../../utils/helper");
var uuid_1 = require("uuid");
var jsdom = require("jsdom");
var SectionController = /** @class */ (function () {
    function SectionController() {
    }
    SectionController.prototype.delete = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, id, user, isSectionExist_1, campaigns, toUpdate, newCampaigns, _i, newCampaigns_1, item, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).send(__assign({ status: "error", message: "Validation error" }, errors))];
                        }
                        id = req.params.id;
                        user = req.body.user;
                        return [4 /*yield*/, db_1.prisma.section.findUnique({
                                where: {
                                    id: id,
                                },
                            })];
                    case 1:
                        isSectionExist_1 = _a.sent();
                        if (!isSectionExist_1) {
                            throw new Error("Section not found.");
                        }
                        return [4 /*yield*/, db_1.prisma.campaign.findMany({
                                where: {
                                    templateId: {
                                        equals: isSectionExist_1.templateId,
                                    },
                                },
                            })];
                    case 2:
                        campaigns = _a.sent();
                        toUpdate = [];
                        if (campaigns) {
                            newCampaigns = campaigns.map(function (campaign) {
                                delete campaign.data[isSectionExist_1.id];
                                return campaign;
                            });
                            for (_i = 0, newCampaigns_1 = newCampaigns; _i < newCampaigns_1.length; _i++) {
                                item = newCampaigns_1[_i];
                                toUpdate.push({ where: { id: item.id }, data: item });
                            }
                        }
                        return [4 /*yield*/, db_1.prisma.$transaction(__spreadArray(__spreadArray([], toUpdate.map(function (item) { return db_1.prisma.campaign.update(item); }), true), [
                                db_1.prisma.section.delete({
                                    where: {
                                        id: id,
                                    },
                                }),
                            ], false))];
                    case 3:
                        _a.sent();
                        res.send({
                            status: "success",
                            message: "Section has been deleted.",
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.log(error_1);
                        res.status(400).send({
                            status: "error",
                            message: error_1.message || "Section has not been deleted.",
                        });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SectionController.prototype.create = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, user, section, template, createdSection_1, campaigns, updatedLayouts, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).send(__assign({ status: "error", message: "Validation error" }, errors))];
                        }
                        user = req.body.user;
                        section = req.body.section;
                        return [4 /*yield*/, (0, helper_1.isTemplateExist)({
                                templatId: section.templateId,
                                userId: user.id,
                                include: {
                                    sections: true,
                                },
                            })];
                    case 1:
                        template = _a.sent();
                        return [4 /*yield*/, db_1.prisma.section.create({
                                data: {
                                    title: section.title,
                                    content: section.content,
                                    placeholders: {
                                        createMany: {
                                            data: section.placeholders,
                                        },
                                    },
                                    templateId: section.templateId,
                                    order: template.sections.length <= 1
                                        ? template.sections.length
                                        : template.sections.length - 1,
                                },
                            })];
                    case 2:
                        createdSection_1 = _a.sent();
                        return [4 /*yield*/, db_1.prisma.campaign.findMany({
                                where: {
                                    templateId: template.id,
                                },
                                include: {
                                    layout: true,
                                },
                            })];
                    case 3:
                        campaigns = _a.sent();
                        if (!(campaigns.length > 0)) return [3 /*break*/, 5];
                        updatedLayouts = campaigns.map(function (item) {
                            return {
                                sectionId: createdSection_1.id,
                                order: item.layout.length,
                                campaignId: item.id,
                                is_active: true,
                                renderOn: {},
                            };
                        });
                        return [4 /*yield*/, db_1.prisma.layout.createMany({
                                data: updatedLayouts,
                            })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        res.send({
                            status: "success",
                            message: "Section has been created.",
                            data: createdSection_1,
                        });
                        return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        console.log(error_2);
                        if (error_2 instanceof library_1.PrismaClientValidationError) {
                            return [2 /*return*/, res.status(400).send({
                                    status: "error",
                                    message: error_2.message,
                                })];
                        }
                        res.status(400).send({
                            status: "error",
                            message: error_2.message || "Section hasn't been created.",
                        });
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    SectionController.prototype.createFromComponent = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, user, section, template, component, dom, body_1, section_placeholders, new_content, createdSection_2, campaigns, updatedLayouts, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).send(__assign({ status: "error", message: "Validation error" }, errors))];
                        }
                        user = req.body.user;
                        section = req.body.section;
                        return [4 /*yield*/, (0, helper_1.isTemplateExist)({
                                templatId: section.templateId,
                                userId: user.id,
                                include: {
                                    sections: true,
                                },
                            })];
                    case 1:
                        template = _a.sent();
                        return [4 /*yield*/, db_1.prisma.component.findUnique({
                                where: {
                                    id: section.componentId,
                                    userId: user.id,
                                },
                                include: {
                                    placeholders: true,
                                },
                            })];
                    case 2:
                        component = _a.sent();
                        if (!component) {
                            throw new Error("Component doesn't exist.");
                        }
                        dom = new jsdom.JSDOM(component.content);
                        body_1 = dom.window.document.body;
                        section_placeholders = component.placeholders.map(function (item) {
                            var id = (0, uuid_1.v4)();
                            var placeholder_to_change = body_1.querySelector("[data-template-it_id='".concat(item.id, "']"));
                            placeholder_to_change.setAttribute("data-template-it_id", id);
                            return {
                                id: id,
                                fallback: item.fallback,
                                title: item.title,
                            };
                        });
                        new_content = body_1.innerHTML;
                        return [4 /*yield*/, db_1.prisma.section.create({
                                data: {
                                    title: "Copied: " + component.title,
                                    content: new_content,
                                    templateId: section.templateId,
                                    order: template.sections.length <= 1
                                        ? template.sections.length
                                        : template.sections.length - 1,
                                    placeholders: {
                                        createMany: {
                                            data: section_placeholders,
                                        },
                                    },
                                },
                            })];
                    case 3:
                        createdSection_2 = _a.sent();
                        return [4 /*yield*/, db_1.prisma.campaign.findMany({
                                where: {
                                    templateId: template.id,
                                },
                                include: {
                                    layout: true,
                                },
                            })];
                    case 4:
                        campaigns = _a.sent();
                        if (!(campaigns.length > 0)) return [3 /*break*/, 6];
                        updatedLayouts = campaigns.map(function (item) {
                            return {
                                sectionId: createdSection_2.id,
                                order: item.layout.length,
                                campaignId: item.id,
                                is_active: true,
                                renderOn: {},
                            };
                        });
                        return [4 /*yield*/, db_1.prisma.layout.createMany({
                                data: updatedLayouts,
                            })];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        res.send({
                            status: "success",
                            message: "Section has been created.",
                            data: createdSection_2,
                        });
                        return [3 /*break*/, 8];
                    case 7:
                        error_3 = _a.sent();
                        console.log(error_3);
                        if (error_3 instanceof library_1.PrismaClientValidationError) {
                            return [2 /*return*/, res.status(400).send({
                                    status: "error",
                                    message: error_3.message || "Section hasn't been created.",
                                })];
                        }
                        res.status(400).send({
                            status: "error",
                            message: error_3.message || "Section hasn't been created.",
                        });
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    SectionController.prototype.getAll = function (req, res) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    SectionController.prototype.getOne = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, user, id, section, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).send(__assign({ status: "error", message: "Validation error" }, errors))];
                        }
                        user = req.body.user;
                        id = req.params.id;
                        return [4 /*yield*/, db_1.prisma.section.findUnique({
                                where: {
                                    id: id,
                                },
                                include: {
                                    placeholders: true,
                                },
                            })];
                    case 1:
                        section = _a.sent();
                        res.send({
                            status: "success",
                            message: section === null ? "Section ".concat(id, " not found") : "Section ".concat(id, " found"),
                            data: section,
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        res.status(400).send({
                            status: "error",
                            message: error_4.message || "Something went wrong",
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SectionController.prototype.update = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, user, section, isSectionExist, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).send(__assign({ status: "error", message: "Validation error" }, errors))];
                        }
                        user = req.body.user;
                        section = req.body.section;
                        return [4 /*yield*/, (0, helper_1.isTemplateExist)({
                                templatId: section.templateId,
                                userId: user.id,
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, db_1.prisma.section.findUnique({
                                where: {
                                    id: section.id,
                                },
                                include: {
                                    placeholders: true,
                                },
                            })];
                    case 2:
                        isSectionExist = _a.sent();
                        if (!isSectionExist) {
                            throw new Error("Section not found.");
                        }
                        return [4 /*yield*/, db_1.prisma.section.update({
                                where: {
                                    id: isSectionExist.id,
                                },
                                data: {
                                    title: section.title,
                                    content: section.content,
                                    placeholders: {
                                        deleteMany: {
                                            id: {
                                                in: section.placeholdersToDelete.map(function (item) { return item.id; }),
                                            },
                                        },
                                        createMany: {
                                            data: section.placeholdersToCreate,
                                        },
                                    },
                                },
                                include: {
                                    placeholders: true,
                                },
                            })];
                    case 3:
                        _a.sent();
                        res.send({
                            status: "success",
                            message: "Section has been updated.",
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        error_5 = _a.sent();
                        console.log(error_5);
                        res.status(400).send({
                            status: "error",
                            message: error_5.message || "Section hasn't been updated.",
                        });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SectionController.prototype.duplicate = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, id, user, sectionToDuplicate, template, campaigns, dom, body_2, section_placeholders, new_content, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).send(__assign({ status: "error", message: "Validation error" }, errors))];
                        }
                        id = req.params.id;
                        user = req.body.user;
                        return [4 /*yield*/, db_1.prisma.section.findUnique({
                                where: {
                                    id: id,
                                },
                                include: {
                                    placeholders: true,
                                },
                            })];
                    case 1:
                        sectionToDuplicate = _a.sent();
                        if (!sectionToDuplicate) {
                            throw new Error("Section not found.");
                        }
                        return [4 /*yield*/, db_1.prisma.template.findUnique({
                                where: {
                                    id: sectionToDuplicate.templateId,
                                },
                                include: {
                                    sections: true,
                                },
                            })];
                    case 2:
                        template = _a.sent();
                        if (!template) {
                            throw new Error("Template not found.");
                        }
                        return [4 /*yield*/, db_1.prisma.campaign.findMany({
                                where: {
                                    templateId: template.id,
                                },
                                include: {
                                    layout: true,
                                },
                            })];
                    case 3:
                        campaigns = _a.sent();
                        dom = new jsdom.JSDOM(sectionToDuplicate.content);
                        body_2 = dom.window.document.body;
                        section_placeholders = sectionToDuplicate.placeholders.map(function (item) {
                            var id = (0, uuid_1.v4)();
                            var placeholder_to_change = body_2.querySelector("[data-template-it_id='".concat(item.id, "']"));
                            placeholder_to_change.setAttribute("data-template-it_id", id);
                            return {
                                id: id,
                                fallback: item.fallback,
                                title: item.title,
                            };
                        });
                        new_content = body_2.innerHTML;
                        return [4 /*yield*/, db_1.prisma.section.create({
                                data: {
                                    title: sectionToDuplicate.title + " copy",
                                    content: new_content,
                                    templateId: sectionToDuplicate.templateId,
                                    Layout: {
                                        createMany: {
                                            data: campaigns.map(function (item) {
                                                return {
                                                    order: item.layout.length,
                                                    campaignId: item.id,
                                                    is_active: true,
                                                    renderOn: {},
                                                };
                                            }),
                                        },
                                    },
                                    placeholders: {
                                        createMany: {
                                            data: section_placeholders,
                                        },
                                    },
                                    order: template.sections.length,
                                },
                            })];
                    case 4:
                        _a.sent();
                        res.send({
                            status: "success",
                            message: "Section has been duplicated.",
                        });
                        return [3 /*break*/, 6];
                    case 5:
                        error_6 = _a.sent();
                        console.log(error_6);
                        if (error_6 instanceof library_1.PrismaClientKnownRequestError) {
                            return [2 /*return*/, res.status(400).send({
                                    status: "error",
                                    message: error_6.meta.cause || "Section has not been duplicated.",
                                })];
                        }
                        res.status(400).send({
                            status: "error",
                            message: error_6.message || "Section has not been duplicated.",
                        });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return SectionController;
}());
exports.SectionController = SectionController;
