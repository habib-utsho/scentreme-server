import { prisma } from "../../../lib/prisma";
import { TAddress } from "./address.interface";
import AppError from "../../errors/appError";
import { StatusCodes } from "http-status-codes";
import { UserStatus } from "../../../generated/prisma/enums";
import calculatePagination from "../../utils/calculatePagination";
import { userSearchableFields } from "../user/user.constant";
import { TOptions } from "../../interface";
import { addressSearchableFields } from "./address.constant";

const assertOwnerOrAdmin = async (addressId: string, userId: string, isAdmin: boolean) => {
    const address = await prisma.address.findUnique({ where: { id: addressId } });

    if (!address) {
        throw new AppError(StatusCodes.NOT_FOUND, "Address not found");
    }
    if (!isAdmin && address.user_id !== userId) {
        throw new AppError(StatusCodes.FORBIDDEN, "You do not have permission to access this address");
    }

    return address;
};

const createAddress = async (userId: string, payload: TAddress) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.status === UserStatus.deleted) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    return prisma.$transaction(async (tx) => {
        if (payload.isDefault) {
            await tx.address.updateMany({
                where: { user_id: userId },
                data: { isDefault: false },
            });
        }

        const address = await tx.address.create({
            data: {
                user_id: userId,
                fullAddress: payload.fullAddress,
                city: payload.city,
                area: payload.area ?? null,
                postalCode: payload.postalCode ?? null,
                isDefault: payload.isDefault ?? false,
                createdAt: new Date(),
                updatedAt: new Date()
            },
        });

        return address;
    });
};

const getMyAddresses = async (userId: string, query: Record<string, unknown>, options: TOptions) => {
    const { searchTerm, ...filterableFields } = query;

    console.log({ filterableFields });

    const parsedQuery: any = {};

    if (searchTerm) {
        parsedQuery.OR = addressSearchableFields.map((field) => {
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
        let value = filterableFields[field];

        if (value !== undefined && value !== null) {
            if (value === "true") {
                value = true;
            }
            else if (value === "false") {
                value = false;
            }

            parsedQuery[field] = value;
        }
    });

    parsedQuery.user_id = userId;

    const { limit, page, skip } = calculatePagination(options);

    const [total, result] = await Promise.all([
        prisma.address.count({ where: { user_id: userId } }),
        prisma.address.findMany({
            where: parsedQuery,
            skip,
            take: limit,
            orderBy: options.sortBy && options.sortOrder ? {
                [options.sortBy]: options.sortOrder,
            } : [
                { isDefault: "desc" },
                { createdAt: "desc" },
            ],
        }),
    ]);
    return { result, meta: { total, limit, page, totalPage: Math.ceil(total / limit), } };

};


const getAllAddresses = async () => {
    return prisma.address.findMany({
        orderBy: [
            { isDefault: "desc" },
            { createdAt: "desc" },
        ],
    });
};

const getAddressById = async (addressId: string, userId: string, isAdmin: boolean) => {

    const address = await assertOwnerOrAdmin(addressId, userId, isAdmin);
    return address;
};

const updateAddress = async (addressId: string, userId: string, isAdmin: boolean, payload: Partial<TAddress>) => {
    const address = await assertOwnerOrAdmin(addressId, userId, isAdmin);

    if (payload.isDefault) {
        await prisma.address.updateMany({
            where: { user_id: address.user_id, id: { not: address.id } },
            data: { isDefault: false },
        });
    }

    const updatedAddress = await prisma.address.update({
        where: { id: address.id },
        data: {
            ...(payload.fullAddress !== undefined ? { fullAddress: payload.fullAddress } : {}),
            ...(payload.city !== undefined ? { city: payload.city } : {}),
            ...(payload.area !== undefined ? { area: payload.area } : {}),
            ...(payload.postalCode !== undefined ? { postalCode: payload.postalCode } : {}),
            ...(payload.isDefault !== undefined ? { isDefault: payload.isDefault } : {}),
            updatedAt: new Date(),
        },
    });

    return updatedAddress;
};

const deleteAddress = async (addressId: string, userId: string, isAdmin: boolean) => {
    await assertOwnerOrAdmin(addressId, userId, isAdmin);

    return prisma.address.delete({
        where: { id: addressId },
    });
};

export const addressServices = {
    createAddress,
    getMyAddresses,
    getAllAddresses,
    getAddressById,
    updateAddress,
    deleteAddress,
};
