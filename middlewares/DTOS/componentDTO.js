"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentDTO = void 0;
var componentDTO = function (DTO) { return function (req, res, next) {
    try {
        var component = new DTO(req.body.component);
        req.body.component = component;
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
exports.componentDTO = componentDTO;
