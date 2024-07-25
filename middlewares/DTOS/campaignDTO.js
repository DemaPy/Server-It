"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignDTO = void 0;
var campaignDTO = function (DTO) { return function (req, res, next) {
    try {
        var campaign = new DTO(req.body.campaign);
        req.body.campaign = campaign;
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
exports.campaignDTO = campaignDTO;
