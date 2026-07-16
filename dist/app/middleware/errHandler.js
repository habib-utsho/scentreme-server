"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrHandler = exports.notFoundErrHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const zod_1 = require("zod");
const handleZodErr_1 = __importDefault(require("../errors/handleZodErr"));
const client_1 = require("../../generated/prisma/client");
const handlePrismaErr_1 = require("../errors/handlePrismaErr");
const env_1 = require("../config/env");
const notFoundErrHandler = (req, res) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send({
        success: false,
        message: error?.message,
        error: error
    });
};
exports.notFoundErrHandler = notFoundErrHandler;
const globalErrHandler = (err, req, res, next) => {
    let statusCode = err.statusCode ?? http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    let message = err.message || 'Internal Server Error';
    let errorSources = [
        {
            path: "",
            message: err.message || "Internal Server Error"
        }
    ];
    if (err instanceof zod_1.ZodError) {
        const ourErr = (0, handleZodErr_1.default)(err);
        ({ statusCode, message, errorSources } = ourErr);
    }
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        const ourErr = (0, handlePrismaErr_1.handlePrismaKnownErr)(err);
        ({ statusCode, message, errorSources } = ourErr);
    }
    else if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        const ourErr = (0, handlePrismaErr_1.handlePrismaValidationErr)(err);
        ({ statusCode, message, errorSources } = ourErr);
    }
    else if (err instanceof client_1.Prisma.PrismaClientInitializationError) {
        const ourErr = (0, handlePrismaErr_1.handlePrismaInitErr)(err);
        ({ statusCode, message, errorSources } = ourErr);
    }
    else if (err instanceof client_1.Prisma.PrismaClientRustPanicError) {
        const ourErr = (0, handlePrismaErr_1.handlePrismaPanicErr)(err);
        ({ statusCode, message, errorSources } = ourErr);
    }
    else if (err instanceof client_1.Prisma.PrismaClientUnknownRequestError) {
        const ourErr = (0, handlePrismaErr_1.handlePrismaUnknownErr)(err);
        ({ statusCode, message, errorSources } = ourErr);
    }
    res.status(statusCode).send({
        success: false,
        message,
        errorSources,
        stack: env_1.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
};
exports.globalErrHandler = globalErrHandler;
//# sourceMappingURL=errHandler.js.map