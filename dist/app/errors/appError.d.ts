declare class AppError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string);
}
export default AppError;
//# sourceMappingURL=appError.d.ts.map