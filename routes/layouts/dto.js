"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLayoutsOrderDTO = exports.UpdateLayoutDTO = void 0;
var UpdateLayoutDTO = /** @class */ (function () {
    function UpdateLayoutDTO(data) {
        this.id = data.id;
        this.is_active = data.is_active;
        this.renderOn = data.renderOn;
    }
    return UpdateLayoutDTO;
}());
exports.UpdateLayoutDTO = UpdateLayoutDTO;
var UpdateLayoutsOrderDTO = /** @class */ (function () {
    function UpdateLayoutsOrderDTO(data) {
        this.layout = [];
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var layout = data_1[_i];
            this.layout.push({
                id: layout.id,
                campaignId: layout.campaignId,
                is_active: layout.is_active,
                order: layout.order,
                renderOn: layout.renderOn,
                sectionId: layout.sectionId
            });
        }
    }
    return UpdateLayoutsOrderDTO;
}());
exports.UpdateLayoutsOrderDTO = UpdateLayoutsOrderDTO;
