import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../../lib/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { addressServices } from "./address.service";
import AppError from "../../errors/appError";
import { Role } from "../../../generated/prisma/enums";
import pick from "../../utils/pick";
import { addressFilterableFields, addressSearchableFields } from "./address.constant";
import { OPTIONS } from "../../constant";

const createAddress: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "User not found in request");
    }

    const result = await addressServices.createAddress(userId, req.body);

    sendResponse(res, StatusCodes.CREATED, {
        success: true,
        message: "Address created successfully",
        data: result,
    });
});

const getMyAddresses: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "User not found in request");
    }

    const filteredQuery = pick(req.query, [...addressSearchableFields, ...addressFilterableFields]);
    const options = pick(req.query, [...OPTIONS]);

    console.log({ filteredQuery, q: req.query });

    const { result, meta } = await addressServices.getMyAddresses(userId, filteredQuery, options);

    sendResponse(res, StatusCodes.OK, {
        success: true,
        message: "Addresses retrieved successfully",
        data: result,
        meta
    });
});

const getAllAddresses: RequestHandler = catchAsync(async (_req: Request, res: Response) => {
    const result = await addressServices.getAllAddresses();

    sendResponse(res, StatusCodes.OK, {
        success: true,
        message: "Addresses retrieved successfully",
        data: result,
    });
});

const getAddressById: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const isAdmin = req.user?.role === Role.admin || req.user?.role === Role.moderator;

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "User not found in request");
    }

    const result = await addressServices.getAddressById(req.params.id as string, userId, isAdmin);

    sendResponse(res, StatusCodes.OK, {
        success: true,
        message: "Address retrieved successfully",
        data: result,
    });
});

const updateAddress: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const isAdmin = req.user?.role === Role.admin || req.user?.role === Role.moderator;

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "User not found in request");
    }

    const result = await addressServices.updateAddress(req.params.id as string, userId, isAdmin, req.body);

    sendResponse(res, StatusCodes.OK, {
        success: true,
        message: "Address updated successfully",
        data: result,
    });
});

const deleteAddress: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const isAdmin = req.user?.role === Role.admin || req.user?.role === Role.moderator;

    if (!userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "User not found in request");
    }

    const result = await addressServices.deleteAddress(req.params.id as string, userId, isAdmin);

    sendResponse(res, StatusCodes.OK, {
        success: true,
        message: "Address deleted successfully",
        data: result,
    });
});

export const addressController = {
    createAddress,
    getMyAddresses,
    getAllAddresses,
    getAddressById,
    updateAddress,
    deleteAddress,
};
