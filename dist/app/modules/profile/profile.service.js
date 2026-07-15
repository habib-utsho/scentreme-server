"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const appError_1 = require("../../errors/appError");
const prisma_1 = require("../../../lib/prisma");
const enums_1 = require("../../../generated/prisma/enums");
const getMe = async (id) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id },
        include: {
            profile: true,
            role: true
        }
    });
    if (!user || user.status === enums_1.UserStatus.deleted || user.profile?.isDeleted) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Profile not found or has been deleted');
    }
    return user;
};
const updateProfile = async (user_id, payload) => {
    const profile = await prisma_1.prisma.profile.findUnique({ where: { user_id } });
    if (!profile || profile.isDeleted) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Profile not found or has been deleted');
    }
    const updateData = {};
    Object.keys(payload).forEach((key) => {
        const value = payload[key];
        if (value === undefined)
            return;
        if (key === 'date_of_birth') {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid date_of_birth format. Expected a valid date string (e.g. YYYY-MM-DD).');
            }
            updateData[key] = date;
        }
        else {
            updateData[key] = value;
        }
    });
    const updatedProfile = await prisma_1.prisma.profile.update({
        where: { user_id },
        data: updateData
    });
    return updatedProfile;
};
const deleteProfile = async (user_id) => {
    const profile = await prisma_1.prisma.profile.findUnique({ where: { user_id } });
    if (!profile || profile.isDeleted) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Profile not found or has been deleted');
    }
    const result = await prisma_1.prisma.$transaction(async (tx) => {
        const profileDelete = await tx.profile.update({
            where: { user_id },
            data: { isDeleted: true }
        });
        const userDelete = await tx.user.update({
            where: { id: user_id },
            data: { status: enums_1.UserStatus.deleted }
        });
        return { profileDelete, userDelete };
    });
    return result;
};
exports.profileServices = { getMe, updateProfile, deleteProfile };
//# sourceMappingURL=profile.service.js.map