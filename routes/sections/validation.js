"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionValidation = void 0;
var express_validator_1 = require("express-validator");
var SectionValidation = /** @class */ (function () {
    function SectionValidation() {
    }
    SectionValidation.prototype.get = function () {
        return [
            (0, express_validator_1.param)("id", "Id is not valid.").exists().notEmpty().isString().isLength({
                min: 5,
            }),
        ];
    };
    SectionValidation.prototype.create = function () {
        return [
            (0, express_validator_1.check)("section.title", "Max: 20, Min: 3 symbols")
                .exists()
                .notEmpty()
                .isLength({
                max: 20,
                min: 3,
            })
                .isString(),
            (0, express_validator_1.check)("section.content", "Content is not valid.").exists().notEmpty().isLength({
                max: 1000000,
                min: 3,
            }),
            (0, express_validator_1.check)("section.templateId", "Template id is not valid.")
                .exists()
                .notEmpty()
                .isLength({
                min: 3,
            })
                .isString(),
        ];
    };
    SectionValidation.prototype.createFromComponent = function () {
        return [
            (0, express_validator_1.check)("section.templateId", "Template id is not valid.")
                .exists()
                .notEmpty()
                .isLength({
                min: 3,
            })
                .isString(),
            (0, express_validator_1.check)("section.componentId", "Content id is not valid.")
                .exists()
                .notEmpty()
                .isLength({
                min: 3,
            })
                .isString(),
        ];
    };
    SectionValidation.prototype.update = function () {
        return [
            (0, express_validator_1.check)("section.id", "Id is not valid.").exists().notEmpty().isString(),
            (0, express_validator_1.check)("section.title", "Max: 20, Min: 3 symbols")
                .exists()
                .notEmpty()
                .isString()
                .isLength({
                max: 20,
                min: 3,
            }),
            (0, express_validator_1.check)("section.content", "Content is not valid.")
                .exists()
                .notEmpty()
                .isString()
                .isLength({
                max: 1000000,
                min: 10,
            }),
        ];
    };
    SectionValidation.prototype.duplicate = function () {
        return [
            (0, express_validator_1.param)("id", "Id is not valid.").exists().notEmpty().isString().isLength({
                min: 5,
            }),
        ];
    };
    SectionValidation.prototype.delete = function () {
        return [
            (0, express_validator_1.param)("id", "Id is not valid.").exists().notEmpty().isString().isLength({
                min: 5,
            }),
        ];
    };
    return SectionValidation;
}());
exports.SectionValidation = SectionValidation;
