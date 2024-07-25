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
exports.ComponentController = void 0;
var db_1 = require("../../db");
var express_validator_1 = require("express-validator");
var ComponentController = /** @class */ (function () {
    function ComponentController() {
    }
    ComponentController.prototype.getAll = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, components, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        user = req.body.user;
                        return [4 /*yield*/, db_1.prisma.component.findMany({
                                where: {
                                    userId: user.id,
                                },
                                include: {
                                    placeholders: true,
                                },
                            })];
                    case 1:
                        components = _a.sent();
                        res.send({
                            status: "success",
                            message: "",
                            data: components,
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        res.status(400).send({
                            status: "error",
                            message: error_1.message || "Something went wrong",
                            error: error_1,
                            data: null,
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComponentController.prototype.getOne = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, user, id, component, error_2;
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
                        return [4 /*yield*/, db_1.prisma.component.findUnique({
                                where: {
                                    id: id,
                                    userId: user.id,
                                },
                                include: {
                                    placeholders: true,
                                },
                            })];
                    case 1:
                        component = _a.sent();
                        res.send({
                            status: "success",
                            message: component === null
                                ? "Component ".concat(id, " not found")
                                : "Component ".concat(id, " found"),
                            data: component,
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
    ComponentController.prototype.create = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, user, component, createdComponent, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).send(__assign({ status: "error", message: "Validation error" }, errors))];
                        }
                        user = req.body.user;
                        component = req.body.component;
                        return [4 /*yield*/, db_1.prisma.component.create({
                                data: {
                                    title: component.title,
                                    content: component.content,
                                    placeholders: {
                                        createMany: { data: component.placeholders },
                                    },
                                    userId: user.id,
                                },
                            })];
                    case 1:
                        createdComponent = _a.sent();
                        res.send({
                            status: "success",
                            message: "Component has been created.",
                            data: createdComponent,
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        res.status(400).send({
                            status: "error",
                            message: error_3.message || "Component hasn't been created.",
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComponentController.prototype.update = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, user, component, isComponentExist, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).send(__assign({ status: "error", message: "Validation error" }, errors))];
                        }
                        user = req.body.user;
                        component = req.body.component;
                        return [4 /*yield*/, db_1.prisma.component.findUnique({
                                where: {
                                    id: component.id,
                                    userId: user.id,
                                },
                                include: {
                                    placeholders: true,
                                },
                            })];
                    case 1:
                        isComponentExist = _a.sent();
                        if (!isComponentExist) {
                            throw new Error("Component not found.");
                        }
                        return [4 /*yield*/, db_1.prisma.component.update({
                                where: {
                                    id: isComponentExist.id,
                                },
                                data: {
                                    title: component.title,
                                    content: component.content,
                                    placeholders: {
                                        deleteMany: {
                                            id: {
                                                in: component.placeholdersToDelete.map(function (item) { return item.id; }),
                                            },
                                        },
                                        createMany: {
                                            data: component.placeholdersToCreate,
                                        },
                                    },
                                },
                                include: {
                                    placeholders: true,
                                },
                            })];
                    case 2:
                        _a.sent();
                        res.send({
                            status: "success",
                            message: "Component has been updated.",
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        console.log(error_4);
                        res.status(400).send({
                            status: "error",
                            message: error_4.message || "Component has not been updated.",
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ComponentController.prototype.delete = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, id, user, deletedComponent, error_5;
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
                        return [4 /*yield*/, db_1.prisma.component.delete({
                                where: {
                                    id: id,
                                    userId: user.id,
                                },
                            })];
                    case 1:
                        deletedComponent = _a.sent();
                        res.send({
                            status: "success",
                            message: "Component has been deleted.",
                            data: deletedComponent,
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        res.status(400).send({
                            status: "error",
                            message: error_5.message || "Component hasn't been deleted.",
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ComponentController;
}());
exports.ComponentController = ComponentController;
