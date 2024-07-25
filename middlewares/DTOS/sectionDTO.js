"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sectionDTO = void 0;
var sectionDTO = function (DTO) { return function (req, res, next) {
    try {
        var section = new DTO(req.body.section);
        req.body.section = section;
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
exports.sectionDTO = sectionDTO;
