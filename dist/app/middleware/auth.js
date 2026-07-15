"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = require("../errors/appError");
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = require("../../lib/catchAsync");
const cookie = require("cookie");
const jwtVerify_1 = require("../utils/jwtVerify");
const prisma_1 = require("../../lib/prisma");
const enums_1 = require("../../generated/prisma/enums");
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
        const decoded = (await (0, jwtVerify_1.default)(bearerToken, process.env.JWT_ACCESS_SECRET));
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