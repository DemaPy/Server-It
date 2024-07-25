"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentValidation = void 0;
var express_validator_1 = require("express-validator");
var ComponentValidation = /** @class */ (function () {
    function ComponentValidation() {
    }
    ComponentValidation.prototype.get = function () {
        return [(0, express_validator_1.param)("id", "Id is not valid.").exists().notEmpty().isString()];
    };
    ComponentValidation.prototype.create = function () {
        return [
            (0, express_validator_1.check)("component.title", "Max: 30, Min: 3 symbols").exists().notEmpty().isLength({
                max: 30,
                min: 3,
            }),
            (0, express_validator_1.check)("component.content", "Content is not valid.")
                .exists()
                .notEmpty()
                .isString()
                .isLength({
                max: 1000000,
                min: 10,
            }),
        ];
    };
    ComponentValidation.prototype.update = function () {
        return [
            (0, express_validator_1.check)("component.id", "Id is not valid.").exists().notEmpty().isString(),
            (0, express_validator_1.check)("component.title", "Max: 30, Min: 3 symbols")
                .exists()
                .notEmpty()
                .isString()
                .isLength({
                max: 30,
                min: 3,
            }),
            (0, express_validator_1.check)("component.content", "Content is not valid.")
                .exists()
                .notEmpty()
                .isString()
                .isLength({
                max: 1000000,
                min: 10,
            }),
        ];
    };
    ComponentValidation.prototype.delete = function () {
        return [(0, express_validator_1.param)("id", "Id is not valid.").exists().notEmpty().isString()];
    };
    return ComponentValidation;
}());
exports.ComponentValidation = ComponentValidation;
