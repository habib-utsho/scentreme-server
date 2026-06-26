import { StatusCodes } from "http-status-codes";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/appError";
import { TUser } from "../user/user.interface";


const getMe = async (id: string) => {
    const profile = await prisma.user.findUnique({
        where: { id },
        include: {
            profile: true,
            role: true
        }
    });
    return profile;
}

const updateProfile = async (user_id: string, payload: Partial<TUser>) => {
    const profile = await prisma.profile.findUnique({ where: { user_id } });
    if (!profile) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Profile not found');
    }
    const updateData: Record<string, any> = {};
    Object.keys(payload).forEach((key) => {
        if (payload[key as keyof TUser] !== undefined) {
            updateData[key] = payload[key as keyof TUser];
        }
    });
    const updatedProfile = await prisma.profile.update({
        where: { user_id },
        data: updateData
    });
    return updatedProfile;
};

export const profileServices = { getMe, updateProfile }