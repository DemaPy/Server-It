"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateComponentDTO = exports.CreateComponentDTO = void 0;
var CreateComponentDTO = /** @class */ (function () {
    function CreateComponentDTO(data) {
        this.title = data.title;
        this.content = data.content;
        this.placeholders = data.placeholders;
    }
    return CreateComponentDTO;
}());
exports.CreateComponentDTO = CreateComponentDTO;
var UpdateComponentDTO = /** @class */ (function () {
    function UpdateComponentDTO(data) {
        this.id = data.id;
        this.title = data.title;
        this.content = data.content;
        this.placeholdersToDelete = data.placeholdersToDelete;
        this.placeholdersToCreate = data.placeholdersToCreate;
    }
    return UpdateComponentDTO;
}());
exports.UpdateComponentDTO = UpdateComponentDTO;
