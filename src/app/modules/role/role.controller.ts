import { Request, RequestHandler, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../lib/catchAsync";
import { roleServices } from "./role.service";


const createRole: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    try {
        const result = await roleServices.createRole(req.body);
        sendResponse(res, StatusCodes.CREATED, {
            success: true,
            message: 'Role created successfully',
            data: result
        });
    } catch (error: any) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: error?.name || 'Failed to create role',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
})

const getRoles: RequestHandler = catchAsync(async (req: Request, res: Response) => {

    const { result, meta } = await roleServices.getRoles(req.query);
    sendResponse(res, StatusCodes.OK, {
        success: true,
        message: 'Roles retrieved successfully',
        data: result,
        meta
    });

}
)

export const roleController = { createRole, getRoles }