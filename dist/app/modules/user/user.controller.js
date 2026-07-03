"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_service_1 = require("./user.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../lib/catchAsync"));
const pick_1 = __importDefault(require("../../utils/pick"));
const user_constant_1 = require("./user.constant");
const constant_1 = require("../../constant");
const createUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.userServices.createUser(req.body);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.CREATED, {
        success: true,
        message: 'User created successfully',
        data: result
    });
});
const getUsers = (0, catchAsync_1.default)(async (req, res) => {
    const filteredQuery = (0, pick_1.default)(req.query, [...user_constant_1.userFilterableFields, ...user_constant_1.userSearchableFields]);
    const options = (0, pick_1.default)(req.query, [...constant_1.OPTIONS]);
    const { result, meta } = await user_service_1.userServices.getUsers(filteredQuery, options);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Users retrieved successfully',
        data: result,
        meta: meta
    });
});
const getUserById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await user_service_1.userServices.getUserById(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'User retrieved successfully',
        data: result
    });
});
exports.userController = { createUser, getUsers, getUserById };
//# sourceMappingURL=user.controller.js.map