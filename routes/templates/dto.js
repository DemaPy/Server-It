"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTemplateDTO = exports.CreateTemplateDTO = void 0;
var CreateTemplateDTO = /** @class */ (function () {
    function CreateTemplateDTO(data) {
        this.title = data.title;
    }
    return CreateTemplateDTO;
}());
exports.CreateTemplateDTO = CreateTemplateDTO;
var UpdateTemplateDTO = /** @class */ (function () {
    function UpdateTemplateDTO(data) {
        this.id = data.id;
        this.title = data.title;
    }
    return UpdateTemplateDTO;
}());
exports.UpdateTemplateDTO = UpdateTemplateDTO;
