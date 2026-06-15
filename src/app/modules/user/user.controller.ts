import { Request, RequestHandler, Response } from "express";
import { userServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../lib/catchAsync";


const createUser: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    try {

        const result = await userServices.createUser(req.body);


        sendResponse(res, StatusCodes.CREATED, {
            success: true,
            message: 'User created successfully',
            data: result
        });
    } catch (error: any) {
        console.error('Error creating user:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: error.name,
            error: error.message || 'An unexpected error occurred'
        });
    }
})

const getUsers: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const { result, meta } = await userServices.getUsers(req.query);
    sendResponse(res, StatusCodes.OK, {
        success: true,
        message: 'Users retrieved successfully',
        data: result,
        meta: meta
    });
})


export const userController = { createUser, getUsers }