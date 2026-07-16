"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../errors/appError"));
const jwtVerify = async (token, tokenSecret) => {
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, tokenSecret);
    }
    catch (e) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized!");
    }
    return decoded;
};
exports.default = jwtVerify;
//# sourceMappingURL=jwtVerify.js.map