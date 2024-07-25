"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateValidation = void 0;
var express_validator_1 = require("express-validator");
var TemplateValidation = /** @class */ (function () {
    function TemplateValidation() {
    }
    TemplateValidation.prototype.get = function () {
        return [(0, express_validator_1.param)("id", "Id is not valid.").exists().notEmpty().isString()];
    };
    TemplateValidation.prototype.create = function () {
        return [
            (0, express_validator_1.check)("template.title", "Max: 35, Min: 3 symbols").exists().notEmpty().isLength({
                max: 35,
                min: 3,
            }),
        ];
    };
    TemplateValidation.prototype.update = function () {
        return [
            (0, express_validator_1.check)("template.id", "Id is not valid.").exists().notEmpty().isString(),
            (0, express_validator_1.check)("template.title", "Max: 35, Min: 3 symbols")
                .exists()
                .notEmpty()
                .isString()
                .isLength({
                max: 35,
                min: 3,
            }),
        ];
    };
    TemplateValidation.prototype.delete = function () {
        return [(0, express_validator_1.param)("template.id", "Id is not valid.").exists().notEmpty().isString()];
    };
    return TemplateValidation;
}());
exports.TemplateValidation = TemplateValidation;
