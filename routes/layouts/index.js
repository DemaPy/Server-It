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
exports.layoutRouter = void 0;
var express_1 = require("express");
var db_1 = require("../../db");
var layoutDTO_1 = require("../../middlewares/DTOS/layoutDTO");
var library_1 = require("@prisma/client/runtime/library");
var dto_1 = require("./dto");
var express_validator_1 = require("express-validator");
var guard_1 = require("../../middlewares/guard");
exports.layoutRouter = (0, express_1.Router)();
exports.layoutRouter.patch("/", guard_1.MIDDLEWARES.user, (0, layoutDTO_1.layoutDTO)(dto_1.UpdateLayoutDTO), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var layout, layoutIsExist, updatedLayout, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                layout = req.body.layout;
                return [4 /*yield*/, db_1.prisma.layout.findUnique({
                        where: {
                            id: layout.id,
                        },
                    })];
            case 1:
                layoutIsExist = _b.sent();
                if (!layoutIsExist) {
                    throw new Error("Layout doesn't exist.");
                }
                return [4 /*yield*/, db_1.prisma.layout.update({
                        where: {
                            id: layout.id,
                        },
                        data: {
                            is_active: layout.is_active,
                            renderOn: layout.renderOn,
                        },
                    })];
            case 2:
                updatedLayout = _b.sent();
                res.send({
                    status: "success",
                    message: "Layout has been updated.",
                    data: updatedLayout,
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                if (error_1 instanceof library_1.PrismaClientKnownRequestError) {
                    res.status(422).send({
                        status: "error",
                        message: (_a = error_1 === null || error_1 === void 0 ? void 0 : error_1.meta) === null || _a === void 0 ? void 0 : _a.cause,
                    });
                    return [2 /*return*/];
                }
                res.status(400).send({
                    status: "error",
                    message: error_1.message,
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.layoutRouter.patch("/order", guard_1.MIDDLEWARES.user, [
    (0, express_validator_1.check)("layout", "Layouts is not valid.").exists().isArray({
        min: 1,
    }),
], (0, layoutDTO_1.layoutDTO)(dto_1.UpdateLayoutsOrderDTO), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, layout, campaign, _i, _a, item, error_2;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 6, , 7]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json(errors)];
                }
                layout = req.body.layout;
                return [4 /*yield*/, db_1.prisma.campaign.findUnique({
                        where: {
                            id: layout.layout[0].campaignId,
                        },
                        include: {
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
                campaign = _d.sent();
                if (!campaign) {
                    throw new Error("Campaign is not found");
                }
                _i = 0, _a = layout.layout;
                _d.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                item = _a[_i];
                return [4 /*yield*/, db_1.prisma.layout.update({
                        where: {
                            id: item.id,
                        },
                        data: item,
                    })];
            case 3:
                _d.sent();
                _d.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                res.send({
                    status: "success",
                    message: "Layout has been updated.",
                    data: __assign(__assign({}, campaign), { layout: layout.layout }),
                });
                return [3 /*break*/, 7];
            case 6:
                error_2 = _d.sent();
                console.log(error_2);
                if (error_2 instanceof Error) {
                    return [2 /*return*/, res.status(400).send({
                            status: "error",
                            message: error_2.message,
                        })];
                }
                if (error_2 instanceof library_1.PrismaClientKnownRequestError) {
                    res.status(422).send({
                        status: "error",
                        message: (_b = error_2 === null || error_2 === void 0 ? void 0 : error_2.meta) === null || _b === void 0 ? void 0 : _b.cause,
                    });
                    return [2 /*return*/];
                }
                res.status(400).send({
                    status: "error",
                    message: (_c = error_2.meta) === null || _c === void 0 ? void 0 : _c.cause,
                });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
exports.layoutRouter.delete("/:id", guard_1.MIDDLEWARES.user, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, deletedLayout, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, db_1.prisma.layout.delete({
                        where: {
                            id: id,
                        },
                    })];
            case 1:
                deletedLayout = _a.sent();
                res.send({
                    status: "success",
                    message: "Layout has been deleted.",
                    data: deletedLayout,
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(400).send({
                    status: "error",
                    message: "Layout hasn't been deleted.",
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
