"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.layoutDTO = void 0;
var layoutDTO = function (DTO) { return function (req, res, next) {
    try {
        var layout = new DTO(req.body.layout);
        req.body.layout = layout;
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
exports.layoutDTO = layoutDTO;
