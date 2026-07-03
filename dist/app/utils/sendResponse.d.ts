import { Response } from "express";
declare const sendResponse: (res: Response, statusCode: number, format: {
    success: boolean;
    message: string;
    data: any;
    accessToken?: string;
    refreshToken?: string;
    meta?: {
        total: number;
        page: number;
        totalPage: number;
        limit: number;
    };
    collection?: string;
}) => void;
export default sendResponse;
//# sourceMappingURL=sendResponse.d.ts.map