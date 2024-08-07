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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
var client_1 = require("@prisma/client");
var db_1 = require("../../db");
var dto_1 = require("../user/dto");
var bcrypt = require("bcrypt");
var express_validator_1 = require("express-validator");
var jwt = require("jsonwebtoken");
var generateAccessToken = function (data) {
    var payload = {
        id: data.id,
        role: data.role,
    };
    var token = jwt.sign(payload, "MY_SUPER_SECRET_KEY", {
        expiresIn: "4h",
    });
    return token;
};
var saltRounds = 10;
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    AuthController.prototype.login = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, data, candidate, isPasswordCorrect, token, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).send(__assign({ status: "error", message: "Validation error" }, errors))];
                        }
                        data = req.body;
                        if ("email" in data && "password" in data) {
                            dto_1.userDTO["email"] = data.email;
                            dto_1.userDTO["password"] = data.password;
                        }
                        else {
                            throw new Error("Validation error");
                        }
                        return [4 /*yield*/, db_1.prisma.user.findUnique({
                                where: {
                                    email: dto_1.userDTO.email,
                                },
                            })];
                    case 1:
                        candidate = _a.sent();
                        if (!candidate) {
                            throw new Error("User not found.");
                        }
                        return [4 /*yield*/, bcrypt.compare(dto_1.userDTO.password, candidate.password)];
                    case 2:
                        isPasswordCorrect = _a.sent();
                        if (!isPasswordCorrect) {
                            throw new Error("Password is not correct.");
                        }
                        token = generateAccessToken(candidate);
                        // res.cookie("accessToken", token, {maxAge: 3600, httpOnly: true})
                        return [2 /*return*/, res.json({ status: "success", data: { token: token } })];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/, res.status(400).json({
                                status: "error",
                                message: error_1.message || "An error occurred",
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.registration = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, data, candidate, hashedPassword, withHashedPassword, _a, password, rest, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).send({
                                    status: "error",
                                    message: "Validation error",
                                    errors: errors,
                                })];
                        }
                        data = req.body;
                        if ("email" in data && "password" in data) {
                            dto_1.userDTO["email"] = data.email;
                            dto_1.userDTO["password"] = data.password;
                        }
                        else {
                            throw new Error("Validation error");
                        }
                        return [4 /*yield*/, db_1.prisma.user.findUnique({
                                where: {
                                    email: dto_1.userDTO.email,
                                },
                            })];
                    case 1:
                        candidate = _b.sent();
                        if (candidate) {
                            throw new Error("User already exists");
                        }
                        return [4 /*yield*/, bcrypt.hash(dto_1.userDTO.password, saltRounds)];
                    case 2:
                        hashedPassword = _b.sent();
                        withHashedPassword = __assign(__assign({}, dto_1.userDTO), { password: hashedPassword });
                        return [4 /*yield*/, db_1.prisma.user.create({
                                data: __assign(__assign({}, withHashedPassword), { role: client_1.Role.USER }),
                            })];
                    case 3:
                        _a = _b.sent(), password = _a.password, rest = __rest(_a, ["password"]);
                        // Return only NOT sensitive data
                        return [2 /*return*/, res
                                .status(200)
                                .json({ data: "Blocked to register new user.", status: "success" })];
                    case 4:
                        error_2 = _b.sent();
                        return [2 /*return*/, res.status(400).json({ status: "error", message: error_2.message })];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return AuthController;
}());
exports.AuthController = AuthController;
