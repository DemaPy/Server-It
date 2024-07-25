"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSectionPlaceholderDTO = exports.CreateSectionPlaceholderDTO = void 0;
var CreateSectionPlaceholderDTO = /** @class */ (function () {
    function CreateSectionPlaceholderDTO(data) {
        this.placeholders = [];
        this.sectionId = data.id;
        this.content = data.content;
        for (var _i = 0, _a = data.placeholders; _i < _a.length; _i++) {
            var placeholder = _a[_i];
            this.placeholders.push({
                fallback: placeholder.fallback,
                title: placeholder.title,
                sectionId: data.id,
                id: placeholder.id,
            });
        }
    }
    return CreateSectionPlaceholderDTO;
}());
exports.CreateSectionPlaceholderDTO = CreateSectionPlaceholderDTO;
var UpdateSectionPlaceholderDTO = /** @class */ (function () {
    function UpdateSectionPlaceholderDTO(data) {
        this.id = data.id;
        this.title = data.title;
        this.fallback = data.fallback;
    }
    return UpdateSectionPlaceholderDTO;
}());
exports.UpdateSectionPlaceholderDTO = UpdateSectionPlaceholderDTO;
