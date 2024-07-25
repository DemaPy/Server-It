"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSectionDTO = exports.CreateSectionFromComponentDTO = exports.CreateSectionDTO = void 0;
var CreateSectionDTO = /** @class */ (function () {
    function CreateSectionDTO(data) {
        this.title = data.title;
        this.templateId = data.templateId;
        this.content = data.content;
        this.placeholders = data.placeholders;
    }
    return CreateSectionDTO;
}());
exports.CreateSectionDTO = CreateSectionDTO;
var CreateSectionFromComponentDTO = /** @class */ (function () {
    function CreateSectionFromComponentDTO(data) {
        this.componentId = data.componentId;
        this.templateId = data.templateId;
    }
    return CreateSectionFromComponentDTO;
}());
exports.CreateSectionFromComponentDTO = CreateSectionFromComponentDTO;
var UpdateSectionDTO = /** @class */ (function () {
    function UpdateSectionDTO(data) {
        this.id = data.id;
        this.title = data.title;
        this.content = data.content;
        this.templateId = data.templateId;
        this.placeholdersToDelete = data.placeholdersToDelete;
        this.placeholdersToCreate = data.placeholdersToCreate;
    }
    return UpdateSectionDTO;
}());
exports.UpdateSectionDTO = UpdateSectionDTO;
