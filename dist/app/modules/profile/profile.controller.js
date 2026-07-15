"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileController = void 0;
const catchAsync_1 = require("../../../lib/catchAsync");
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = require("../../utils/sendResponse");
const profile_service_1 = require("./profile.service");
const appError_1 = require("../../errors/appError");
const getMe = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'User ID not found in request');
    }
    const result = await profile_service_1.profileServices.getMe(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Profile retrieved successfully',
        data: result
    });
});
const updateProfile = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await profile_service_1.profileServices.updateProfile(id, payload);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Profile updated successfully',
        data: result
    });
});
const deleteProfile = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await profile_service_1.profileServices.deleteProfile(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Profile deleted successfully',
        data: result
    });
});
exports.profileController = { getMe, updateProfile, deleteProfile };
//# sourceMappingURL=profile.controller.js.map