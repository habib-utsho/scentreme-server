"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calculatePagination = (options) => {
    const { page, limit } = options;
    const pageNumber = Math.max(1, parseInt(page) || 1);
    const limitNumber = Math.max(1, parseInt(limit) || 10);
    const skip = (pageNumber - 1) * limitNumber;
    return { skip, limit: limitNumber, page: pageNumber };
};
exports.default = calculatePagination;
//# sourceMappingURL=calculatePagination.js.map