import { prisma } from "../../../lib/prisma";
import bcrypt from "bcrypt"
import AppError from "../../errors/appError";
import { StatusCodes } from "http-status-codes";
import { TUser } from "./user.interface";
import { userSearchableFields } from "./user.constant";
import { TOptions } from "../../interface";
import calculatePagination from "../../utils/calculatePagination";
import { uploadImgToCloudinary } from "../../utils/uploadImgToCloudinary";
import { Role } from "../../../generated/prisma/enums";

const createCustomer = async (payload: TUser, file: any) => {
    const hashedPassword = await bcrypt.hash(payload.password, parseInt(process.env.SALT_ROUNDS || '10'));
    if (!hashedPassword) {
        throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Password hashing failed');
    }


    const userData = {
        email: payload.email,
        password: hashedPassword,
        role: Role.customer,
        status: payload.status || 'active',
        last_login_at: null,
        failed_login_attempts: 0,
        locked_until: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    const profile = {
        name: payload.name,
        phone: payload.phone,
        date_of_birth: payload.date_of_birth ? new Date(payload.date_of_birth) : null,
        avatar_url: payload.avatar_url,
        gender: payload.gender,
        isDeleted: payload.isDeleted || false,
        createdAt: new Date(),
        updatedAt: new Date()
    }


    const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: userData,
            omit: {
                password: true,
            }
        });

        // file upload
        if (file?.path) {
            const cloudinaryRes = await uploadImgToCloudinary(
                `${payload.name}-${Date.now()}`,
                file.path,
            )
            if (cloudinaryRes?.secure_url) {
                profile.avatar_url = cloudinaryRes.secure_url
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
}

const createAdminModerator = async (payload: TUser, file: any) => {
    const hashedPassword = await bcrypt.hash(payload.password, parseInt(process.env.SALT_ROUNDS || '10'));
    if (!hashedPassword) {
        throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Password hashing failed');
    }


    const userData = {
        email: payload.email,
        password: hashedPassword,
        role: Role[payload.role as keyof typeof Role] || Role.customer,
        status: payload.status || 'active',
        last_login_at: null,
        failed_login_attempts: 0,
        locked_until: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    const profile = {
        name: payload.name,
        phone: payload.phone,
        date_of_birth: payload.date_of_birth ? new Date(payload.date_of_birth) : null,
        avatar_url: payload.avatar_url,
        gender: payload.gender,
        isDeleted: payload.isDeleted || false,
        createdAt: new Date(),
        updatedAt: new Date()
    }


    const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: userData,
            omit: {
                password: true,
            }
        });

        // file upload
        if (file?.path) {
            const cloudinaryRes = await uploadImgToCloudinary(
                `${payload.name}-${Date.now()}`,
                file.path,
            )
            if (cloudinaryRes?.secure_url) {
                profile.avatar_url = cloudinaryRes.secure_url
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
}


const getUsers = async (query: Record<string, unknown>, options: TOptions) => {
    const { searchTerm, ...filterableFields } = query;

    const parsedQuery: any = {};

    if (searchTerm) {
        parsedQuery.OR = userSearchableFields.map((field) => {
            if (field.includes(".")) {
                const [relation, nestedField] = field.split(".");

                return {
                    [relation as string]: {
                        [nestedField as string]: {
                            contains: searchTerm,
                            mode: "insensitive",
                        },
                    },
                };
            }

            return {
                [field as string]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            };
        });
    }

    Object.keys(filterableFields).forEach((field: string) => {
        if (filterableFields[field]) {
            parsedQuery[field] = filterableFields[field];
        }
    })

    // parsedQuery.status = 'active';
    parsedQuery.status = { not: 'deleted' };

    const { limit, page, skip } = calculatePagination(options);

    const [total, result] = await Promise.all([
        prisma.user.count({
            where: parsedQuery,
        }),
        prisma.user.findMany({
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
                profile: true
            }
        }),
    ]);
    return { result, meta: { total, limit, page, totalPage: Math.ceil(total / limit), } };
}


const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id
        },
        omit: {
            password: true,
        },
    });
    return user;
}

export const userServices = { createCustomer, createAdminModerator, getUsers, getUserById }