"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeholderDTO = void 0;
var placeholderDTO = function (DTO) { return function (req, res, next) {
    try {
        var placeholder = new DTO(req.body.placeholder);
        req.body.placeholder = placeholder;
        next();
    }
    catch (error) {
        res.status(400).send({
            status: "error",
            message: error.message || "Bad Request",
        });
        console.error(error);
    }
}; };
exports.placeholderDTO = placeholderDTO;
