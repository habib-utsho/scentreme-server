"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const handleZodErr = (error) => {
    const statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
    const message = `Validation failed: ${error.issues?.map((issue) => issue.path.join(".")).join(", ")}`;
    const errorSources = error.issues.map((issue) => {
        return {
            path: issue.path.join("."),
            message: issue.message
        };
    });
    return {
        statusCode,
        message,
        errorSources
    };
};
exports.default = handleZodErr;
//# sourceMappingURL=handleZodErr.js.map