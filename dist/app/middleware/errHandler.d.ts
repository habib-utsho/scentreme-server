import { NextFunction, Request, Response } from "express";
declare const notFoundErrHandler: (req: Request, res: Response) => void;
interface CustomError extends Error {
    statusCode?: number;
}
declare const globalErrHandler: (err: CustomError, req: Request, res: Response, next: NextFunction) => void;
export { notFoundErrHandler, globalErrHandler };
//# sourceMappingURL=errHandler.d.ts.map