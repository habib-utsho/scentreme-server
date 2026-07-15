"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleController = void 0;
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = require("../../../lib/catchAsync");
const role_service_1 = require("./role.service");
const createRole = (0, catchAsync_1.default)(async (req, res) => {
    const result = await role_service_1.roleServices.createRole(req.body);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.CREATED, {
        success: true,
        message: 'Role created successfully',
        data: result
    });
});
const getRoles = (0, catchAsync_1.default)(async (req, res) => {
    const { result, meta } = await role_service_1.roleServices.getRoles(req.query);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Roles retrieved successfully',
        data: result,
        meta
    });
});
exports.roleController = { createRole, getRoles };
//# sourceMappingURL=role.controller.js.map