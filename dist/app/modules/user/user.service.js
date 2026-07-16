"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const prisma_1 = require("../../../lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const appError_1 = __importDefault(require("../../errors/appError"));
const http_status_codes_1 = require("http-status-codes");
const user_constant_1 = require("./user.constant");
const calculatePagination_1 = __importDefault(require("../../utils/calculatePagination"));
const uploadImgToCloudinary_1 = require("../../utils/uploadImgToCloudinary");
const createUser = async (payload, file) => {
    const role = payload.role_id ? await prisma_1.prisma.role.findUnique({ where: { id: payload.role_id } }) : await prisma_1.prisma.role.findUnique({ where: { name: 'customer' } });
    if (!role) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid role_id provided or default customer role not found');
    }
    const hashedPassword = await bcrypt_1.default.hash(payload.password, parseInt(process.env.SALT_ROUNDS || '10'));
    if (!hashedPassword) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Password hashing failed');
    }
    const userData = {
        email: payload.email,
        password: hashedPassword,
        role_id: role.id,
        status: payload.status || 'active',
        last_login_at: null,
        failed_login_attempts: 0,
        locked_until: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const profile = {
        name: payload.name,
        phone: payload.phone,
        date_of_birth: payload.date_of_birth ? new Date(payload.date_of_birth) : null,
        avatar_url: payload.avatar_url,
        gender: payload.gender,
        isDeleted: payload.isDeleted || false,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    const result = await prisma_1.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: userData,
        });
        // file upload
        if (file?.path) {
            const cloudinaryRes = await (0, uploadImgToCloudinary_1.uploadImgToCloudinary)(`${payload.name}-${Date.now()}`, file.path);
            if (cloudinaryRes?.secure_url) {
                profile.avatar_url = cloudinaryRes.secure_url;
            }
        }
        const createdProfile = await tx.profile.create({
            data: {
                ...profile,
                user_id: user.id,
            }
        });
        return { user, profile: createdProfile };
    });
    return result;
};
const getUsers = async (query, options) => {
    const { searchTerm, ...filterableFields } = query;
    const parsedQuery = {};
    if (searchTerm) {
        parsedQuery.OR = user_constant_1.userSearchableFields.map((field) => {
            if (field.includes(".")) {
                const [relation, nestedField] = field.split(".");
                return {
                    [relation]: {
                        [nestedField]: {
                            contains: searchTerm,
                            mode: "insensitive",
                        },
                    },
                };
            }
            return {
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            };
        });
    }
    Object.keys(filterableFields).forEach((field) => {
        if (filterableFields[field]) {
            parsedQuery[field] = filterableFields[field];
        }
    });
    // parsedQuery.status = 'active';
    parsedQuery.status = { not: 'deleted' };
    const { limit, page, skip } = (0, calculatePagination_1.default)(options);
    const [total, result] = await Promise.all([
        prisma_1.prisma.user.count({
            where: parsedQuery,
        }),
        prisma_1.prisma.user.findMany({
            where: parsedQuery,
            skip,
            take: limit,
            orderBy: options.sortBy && options.sortOrder ? {
                [options.sortBy]: options.sortOrder,
            } : {
                createdAt: 'desc',
            },
            omit: {
                password: true,
            },
            include: {
                role: true,
                profile: true
            }
        }),
    ]);
    return { result, meta: { total, limit, page, totalPage: Math.ceil(total / limit), } };
};
const getUserById = async (id) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: {
            id
        },
        include: {
            role: true,
        }
    });
    return user;
};
exports.userServices = { createUser, getUsers, getUserById };
//# sourceMappingURL=user.service.js.map