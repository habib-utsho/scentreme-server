import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import { TUser } from "../user/user.interface";
import { prisma } from "../../../lib/prisma";
import { UserStatus } from "../../../generated/prisma/enums";
import { User } from "../../../generated/prisma/client";


const getMe = async (id: string): Promise<User | null> => {

    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            profile: true,
            role: true
        }
    });
    if (!user || user.status === UserStatus.deleted || user.profile?.isDeleted) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Profile not found or has been deleted');
    }
    return user;
}

const updateProfile = async (user_id: string, payload: Partial<TUser>) => {
    const profile = await prisma.profile.findUnique({ where: { user_id } });
    if (!profile || profile.isDeleted) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Profile not found or has been deleted');
    }

    const updateData: Record<string, any> = {};
    Object.keys(payload).forEach((key) => {
        const value = payload[key as keyof TUser];
        if (value === undefined) return;

        if (key === 'date_of_birth') {
            const date = new Date(value as string);
            if (isNaN(date.getTime())) {
                throw new AppError(
                    StatusCodes.BAD_REQUEST,
                    'Invalid date_of_birth format. Expected a valid date string (e.g. YYYY-MM-DD).'
                );
            }
            updateData[key] = date;
        } else {
            updateData[key] = value;
        }
    });

    const updatedProfile = await prisma.profile.update({
        where: { user_id },
        data: updateData
    });
    return updatedProfile;
};


const deleteProfile = async (user_id: string) => {
    const profile = await prisma.profile.findUnique({ where: { user_id } });
    if (!profile || profile.isDeleted) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Profile not found or has been deleted');
    }

    const result = await prisma.$transaction(async tx => {
        const profileDelete = await tx.profile.update({
            where: { user_id },
            data: { isDeleted: true }
        });

        const userDelete = await tx.user.update({
            where: { id: user_id },
            data: { status: UserStatus.deleted }
        });

        return { profileDelete, userDelete };
    });
    return result;
};

export const profileServices = { getMe, updateProfile, deleteProfile }