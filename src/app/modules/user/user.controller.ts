import { Request, RequestHandler, Response } from "express";
import { userServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../lib/catchAsync";
import pick from "../../utils/pick";
import { userFilterableFields, userSearchableFields } from "./user.constant";
import { OPTIONS } from "../../constant";
import { firstLetterCapital } from "../../utils/firstLetterCapital";


const createCustomer: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await userServices.createCustomer(req.body, req.file);


    sendResponse(res, StatusCodes.CREATED, {
        success: true,
        message: 'Customer created successfully',
        data: result
    });

})

const createAdminModerator: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await userServices.createAdminModerator(req.body, req.file);

    sendResponse(res, StatusCodes.CREATED, {
        success: true,
        message: `${firstLetterCapital(req.body.role)} created successfully`,
        data: result
    });
})

const getUsers: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const filteredQuery = pick(req.query, [...userFilterableFields, ...userSearchableFields]);
    const options = pick(req.query, [...OPTIONS]);
    const { result, meta } = await userServices.getUsers(filteredQuery, options);

    sendResponse(res, StatusCodes.OK, {
        success: true,
        message: 'Users retrieved successfully',
        data: result,
        meta: meta
    });
})

const getUserById: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await userServices.getUserById(id as string);

    sendResponse(res, StatusCodes.OK, {
        success: true,
        message: 'User retrieved successfully',
        data: result
    });
})



export const userController = { createCustomer, createAdminModerator, getUsers, getUserById }