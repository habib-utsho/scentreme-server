"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, statusCode, format) => {
    res.status(statusCode).send({
        success: format?.success,
        message: format?.message,
        data: format?.data || null,
        meta: format?.meta || null,
        ...(format?.accessToken ? { accessToken: format.accessToken }
            : {}),
        ...(format?.refreshToken ? { refreshToken: format.refreshToken }
            : {}),
        ...(format?.collection ? { collection: format.collection }
            : {}),
    });
};
exports.default = sendResponse;
//# sourceMappingURL=sendResponse.js.map