import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../../lib/catchAsync";
import { TUser } from "../user/user.interface";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import { profileServices } from "./profile.service";
import AppError from "../../errors/appError";


const getMe: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    if (!id) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'User ID not found in request');
    }

    const result = await profileServices.getMe(id as string);

    sendResponse(res, StatusCodes.OK, {
        success: true,
        message: 'Profile retrieved successfully',
        data: result
    });
})

const updateProfile: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await profileServices.updateProfile(id as string, payload as Partial<TUser>);

    sendResponse(res, StatusCodes.OK, {
        success: true,
        message: 'Profile updated successfully',
        data: result
    });
})


const deleteProfile: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await profileServices.deleteProfile(id as string);

    sendResponse(res, StatusCodes.OK, {
        success: true,
        message: 'Profile deleted successfully',
        data: result
    });
})

export const profileController = { getMe, updateProfile, deleteProfile }

