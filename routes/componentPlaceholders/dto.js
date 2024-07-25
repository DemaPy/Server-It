"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateComponentPlaceholderDTO = exports.CreateComponentPlaceholderDTO = void 0;
var CreateComponentPlaceholderDTO = /** @class */ (function () {
    function CreateComponentPlaceholderDTO(data) {
        this.placeholders = [];
        this.componentId = data.id;
        this.content = data.content;
        for (var _i = 0, _a = data.placeholders; _i < _a.length; _i++) {
            var placeholder = _a[_i];
            this.placeholders.push({
                id: placeholder.id,
                fallback: placeholder.fallback,
                title: placeholder.title,
                componentId: data.id
            });
        }
    }
    return CreateComponentPlaceholderDTO;
}());
exports.CreateComponentPlaceholderDTO = CreateComponentPlaceholderDTO;
var UpdateComponentPlaceholderDTO = /** @class */ (function () {
    function UpdateComponentPlaceholderDTO(data) {
        this.id = data.id;
        this.title = data.title;
        this.fallback = data.fallback;
    }
    return UpdateComponentPlaceholderDTO;
}());
exports.UpdateComponentPlaceholderDTO = UpdateComponentPlaceholderDTO;
