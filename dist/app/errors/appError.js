"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    statusCode;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}
exports.default = AppError;
//# sourceMappingURL=appError.js.map