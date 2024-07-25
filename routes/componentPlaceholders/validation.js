"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentPlaceholderValidation = void 0;
var express_validator_1 = require("express-validator");
var ComponentPlaceholderValidation = /** @class */ (function () {
    function ComponentPlaceholderValidation() {
    }
    ComponentPlaceholderValidation.prototype.create = function () {
        return [
            (0, express_validator_1.check)("placeholder.id", "Min: 3 symbols")
                .exists()
                .notEmpty()
                .isLength({
                min: 3,
            })
                .isString(),
            (0, express_validator_1.check)("placeholder.content", "Content is not valid.")
                .exists()
                .notEmpty()
                .isLength({
                max: 1000000,
                min: 3,
            }),
            (0, express_validator_1.check)("placeholder.placeholders", "Placehoders is not valid.")
                .exists()
                .notEmpty()
                .isArray({
                min: 1,
            }),
        ];
    };
    return ComponentPlaceholderValidation;
}());
exports.ComponentPlaceholderValidation = ComponentPlaceholderValidation;
