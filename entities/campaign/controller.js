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
exports.CampaignController = void 0;
var db_1 = require("../../db");
var express_validator_1 = require("express-validator");
var library_1 = require("@prisma/client/runtime/library");
var CampaignController = /** @class */ (function () {
    function CampaignController() {
    }
    CampaignController.prototype.create = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, user, campaign, template, createdCampaign_1, createdLayouts, layouts, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).send(__assign({ status: "error", message: "Validation error" }, errors))];
                        }
                        user = req.body.user;
                        campaign = req.body.campaign;
                        return [4 /*yield*/, db_1.prisma.template.findUnique({
                                where: {
                                    id: campaign.templateId,
                                    userId: user.id,
                                },
                                include: {
                                    sections: true,
                                },
                            })];
                    case 1:
                        template = _a.sent();
                        if (!template) {
                            throw new Error("Template not found.");
                        }
                        return [4 /*yield*/, db_1.prisma.campaign.create({
                                data: {
                                    title: campaign.title,
                                    data: {},
                                    templateId: campaign.templateId,
                                    userId: user.id,
                                },
                            })];
                    case 2:
                        createdCampaign_1 = _a.sent();
                        createdLayouts = void 0;
                        if (!(template.sections.length > 0)) return [3 /*break*/, 4];
                        layouts = template.sections.map(function (item, idx) { return ({
                            order: idx,
                            is_active: true,
                            renderOn: {},
                            sectionId: item.id,
                            campaignId: createdCampaign_1.id,
                        }); });
                        return [4 /*yield*/, db_1.prisma.layout.createMany({
                                data: layouts,
                            })];
                    case 3:
                        createdLayouts = _a.sent();
                        _a.label = 4;
                    case 4:
                        res.send({
                            status: "success",
                            message: "Campaign has been created.",
                            data: __assign(__assign({}, createdCampaign_1), { layout: createdLayouts }),
                        });
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        res.status(400).send({
                            status: "error",
                            message: error_1.message || "Campaign hasn't been created.",
                        });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    CampaignController.prototype.createData = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, id, user, placeholder_data, sectionId, campaign, section, isSectionWithDataExists, allSlugs_1, generateSlugs, error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).send(__assign({ status: "error", message: "Validation error" }, errors))];
                        }
                        id = req.params.id;
                        user = req.body.user;
                        delete req.body.user;
                        placeholder_data = req.body.campaign;
                        sectionId = Object.keys(placeholder_data.data)[0];
                        return [4 /*yield*/, db_1.prisma.campaign.findUnique({
                                where: {
                                    id: id,
                                    userId: user.id,
                                },
                                include: {
                                    layout: {
                                        where: {
                                            sectionId: sectionId,
                                        },
                                    },
                                },
                            })];
                    case 1:
                        campaign = _b.sent();
                        if (!campaign) {
                            throw new Error("Campaign not found.");
                        }
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
                        isSectionWithDataExists = false;
                        if (sectionId in campaign.data) {
                            isSectionWithDataExists = true;
                        }
                        allSlugs_1 = Object.values(Object.values(placeholder_data.data)[0]);
                        generateSlugs = function () {
                            var _slugs = {};
                            for (var _i = 0, allSlugs_2 = allSlugs_1; _i < allSlugs_2.length; _i++) {
                                var iterator = allSlugs_2[_i];
                                var slugs = Object.keys(iterator);
                                for (var _a = 0, slugs_1 = slugs; _a < slugs_1.length; _a++) {
                                    var slug = slugs_1[_a];
                                    if (slug in _slugs) {
                                        continue;
                                    }
                                    else {
                                        if (slug !== "") {
                                            _slugs[slug] = true;
                                        }
                                    }
                                }
                            }
                            return _slugs;
                        };
                        return [4 /*yield*/, db_1.prisma.campaign.update({
                                where: {
                                    id: id,
                                },
                                data: {
                                    data: isSectionWithDataExists
                                        ? __assign(__assign({}, campaign.data), (_a = {}, _a[sectionId] = __assign(__assign({}, campaign.data[sectionId]), placeholder_data[sectionId]), _a)) : __assign(__assign({}, campaign.data), placeholder_data.data),
                                },
                            })];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, db_1.prisma.layout.update({
                                where: {
                                    id: campaign.layout[0].id,
                                },
                                data: {
                                    renderOn: generateSlugs(),
                                },
                            })];
                    case 4:
                        _b.sent();
                        res.send({
                            status: "success",
                            message: "Campaign data has been created.",
                        });
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _b.sent();
                        res.status(400).send({
                            status: "error",
                            message: error_2.message || "Campaign data hasn't been created.",
                        });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    CampaignController.prototype.deleteData = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, id, user, deletedCampaign, error_3;
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
                        return [4 /*yield*/, db_1.prisma.campaign.delete({
                                where: {
                                    id: id,
                                    userId: user.id,
                                },
                            })];
                    case 1:
                        deletedCampaign = _a.sent();
                        res.send({
                            status: "success",
                            message: "Campaign has been deleted.",
                            data: deletedCampaign,
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        res.status(400).send({
                            status: "error",
                            message: error_3.message || "Campaign hasn't been deleted.",
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CampaignController.prototype.delete = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, id, user, deletedCampaign, error_4;
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
                        return [4 /*yield*/, db_1.prisma.campaign.delete({
                                where: {
                                    id: id,
                                    userId: user.id,
                                },
                            })];
                    case 1:
                        deletedCampaign = _a.sent();
                        res.send({
                            status: "success",
                            message: "Campaign has been deleted.",
                            data: deletedCampaign,
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        res.status(400).send({
                            status: "error",
                            message: error_4.message || "Campaign hasn't been deleted.",
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CampaignController.prototype.update = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, user, campaign, updatedCampaign, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).send(__assign({ status: "error", message: "Validation error" }, errors))];
                        }
                        user = req.body.user;
                        campaign = req.body.campaign;
                        return [4 /*yield*/, db_1.prisma.campaign.update({
                                where: {
                                    id: campaign.id,
                                    userId: user.id,
                                },
                                data: {
                                    title: campaign.title,
                                },
                            })];
                    case 1:
                        updatedCampaign = _a.sent();
                        res.send({
                            status: "success",
                            message: "Campaign has been updated.",
                            data: updatedCampaign,
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        if (error_5 instanceof library_1.PrismaClientValidationError) {
                            return [2 /*return*/, res.status(400).send({
                                    status: "error",
                                    message: error_5.message,
                                })];
                        }
                        res.status(400).send({
                            status: "error",
                            message: error_5.message || "Campaign hasn't been updated.",
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CampaignController.prototype.getAll = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, campaigns, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        user = req.body.user;
                        return [4 /*yield*/, db_1.prisma.campaign.findMany({
                                where: {
                                    userId: user.role === "GUEST"
                                        ? "07fde4aa-1377-44db-853e-df3561429d9b"
                                        : user.id,
                                },
                            })];
                    case 1:
                        campaigns = _a.sent();
                        res.send({
                            status: "success",
                            message: "",
                            data: campaigns,
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        res.status(400).send({
                            status: "error",
                            message: error_6.message || "Something went wrong",
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CampaignController.prototype.getOne = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, id, user, campaign, error_7;
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
                        return [4 /*yield*/, db_1.prisma.campaign.findUnique({
                                where: {
                                    id: id,
                                    userId: user.role === "GUEST"
                                        ? "07fde4aa-1377-44db-853e-df3561429d9b"
                                        : user.id,
                                },
                                include: {
                                    layout: true,
                                    template: {
                                        select: {
                                            sections: {
                                                include: {
                                                    placeholders: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            })];
                    case 1:
                        campaign = _a.sent();
                        res.send({
                            status: "success",
                            message: campaign === null ? "Campaign not found" : "Campaign found",
                            data: campaign,
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        res.status(400).send({
                            status: "error",
                            message: error_7.message || "Something went wrong",
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return CampaignController;
}());
exports.CampaignController = CampaignController;
