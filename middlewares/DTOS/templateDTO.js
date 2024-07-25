"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateDTO = void 0;
var templateDTO = function (DTO) { return function (req, res, next) {
    try {
        var template = new DTO(req.body.template);
        req.body.template = template;
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
exports.templateDTO = templateDTO;
