"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pick = (obj, keys) => {
    const picked = {};
    keys.forEach(key => {
        if (obj[key]) {
            picked[key] = obj[key];
        }
    });
    return picked;
};
exports.default = pick;
//# sourceMappingURL=pick.js.map