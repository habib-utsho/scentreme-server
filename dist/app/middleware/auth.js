"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../errors/appError"));
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../lib/catchAsync"));
const cookie = __importStar(require("cookie"));
const jwtVerify_1 = __importDefault(require("../utils/jwtVerify"));
const prisma_1 = require("../../lib/prisma");
const enums_1 = require("../../generated/prisma/enums");
const env_1 = require("../config/env");
const auth = () => {
    return (0, catchAsync_1.default)(async (req, res, next) => {
        // Parse cookies from header
        const token = req.headers.authorization || `Bearer ${cookie.parseCookie(req.headers?.cookie || "")?.accessToken}`;
        console.log({ token });
        if (!token) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not authorized!');
        }
        const bearerToken = token.split(' ')?.[1];
        if (!bearerToken) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not authorized!');
        }
        const decoded = (await (0, jwtVerify_1.default)(bearerToken, env_1.env.JWT_ACCESS_SECRET));
        const { email } = decoded;
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'This user is not found!');
        }
        const isDeleted = user?.status === enums_1.UserStatus.deleted;
        const isInactive = user?.status === enums_1.UserStatus.inactive;
        if (isDeleted) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'This user is deleted!');
        }
        if (isInactive) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'This user is not active!');
        }
        req.user = decoded;
        next();
    });
};
exports.default = auth;
//# sourceMappingURL=auth.js.map