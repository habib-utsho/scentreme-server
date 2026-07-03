"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((err) => next(err));
    };
    //     return async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         await fn(req, res, next);
    //     } catch (err) {
    //         next(err);
    //     }
    // }
};
exports.default = catchAsync;
//# sourceMappingURL=catchAsync.js.map