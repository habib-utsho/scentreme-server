import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { TErrorSource } from "../interface/error";
import { ZodError } from "zod";
import handleZodErr from "../errors/handleZodErr";
import { Prisma } from "../../generated/prisma/client";


const notFoundErrHandler = (req: Request, res: Response) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(StatusCodes.NOT_FOUND).send({
        success: false,
        message: error?.message,
        error: error
    });
};

type THandledError = {
    statusCode: number;
    message: string;
    errorSources: TErrorSource[];
};

interface CustomError extends Error {
    statusCode?: number;
}


// 1. PrismaClientKnownRequestError — has err.code, the most common case
const handlePrismaKnownErr = (err: Prisma.PrismaClientKnownRequestError): THandledError => {
    let statusCode: number = StatusCodes.BAD_REQUEST;
    let message = "Database operation failed";

    switch (err.code) {
        case "P2002": {
            statusCode = StatusCodes.CONFLICT;
            const target = (err.meta?.target as string[] | undefined)?.join(", ");
            message = `Duplicate value for field(s): ${target ?? "unknown field"}`;
            break;
        }
        case "P2025":
            statusCode = StatusCodes.NOT_FOUND;
            message = "The requested record was not found";
            break;
        case "P2003": {
            statusCode = StatusCodes.BAD_REQUEST;
            const field = err.meta?.field_name as string | undefined;
            message = `Invalid reference${field ? ` for field: ${field}` : ""} (foreign key constraint failed)`;
            break;
        }
        case "P2014":
            statusCode = StatusCodes.BAD_REQUEST;
            message = "The change would violate a required relation";
            break;
        case "P2011": {
            const target = (err.meta?.target as string[] | undefined)?.join(", ");
            statusCode = StatusCodes.BAD_REQUEST;
            message = `Null value not allowed for field(s): ${target ?? "unknown"}`;
            break;
        }
        case "P2000":
            statusCode = StatusCodes.BAD_REQUEST;
            message = "Provided value is too long for the column";
            break;
        default:
            // Log full detail internally, don't leak raw DB message to client
            console.error(`Unhandled Prisma error code: ${err.code}`, err.message);
            message = "Database operation failed";
    }

    return { statusCode, message, errorSources: [{ path: "", message }] };
};

// 2. PrismaClientValidationError — Prisma client called with bad shape/types
const handlePrismaValidationErr = (err: Prisma.PrismaClientValidationError): THandledError => {
    console.log("err mssg->>>>", err.message);
    // Try to pull out the specific "Argument `x`: ..." line, which is the
    // most useful part of Prisma's message.
    const argumentMatch = err.message.match(/Argument `(\w+)`: (.+)/);
    // Try to pull out "Expected X, provided Y" for an even tighter message
    const typeMatch = err.message.match(/Expected (\w+), provided (\w+)/);

    console.log({ argumentMatch, typeMatch }, "");

    let path = undefined;
    let message = "Invalid data passed to database query";

    if (argumentMatch) {
        path = argumentMatch[1];
        message = typeMatch
            ? `Invalid value for field "${path}": expected ${typeMatch[1]}, got ${typeMatch[2]}`
            : `Invalid value for field "${path}": ${argumentMatch[2]?.split("\n")[0]?.trim()}`;
    }

    return {
        statusCode: StatusCodes.BAD_REQUEST,
        message,
        errorSources: [{ path, message }],
    };
};

// 3. PrismaClientInitializationError — can't connect to DB
const handlePrismaInitErr = (err: Prisma.PrismaClientInitializationError): THandledError => {
    const message = "Could not connect to the database";
    return {
        statusCode: StatusCodes.SERVICE_UNAVAILABLE, // 503, not 500 — it's a dependency outage
        message,
        errorSources: [{ path: "", message }],
    };
};

// 4. PrismaClientRustPanicError — engine crashed, treat as fatal
const handlePrismaPanicErr = (err: Prisma.PrismaClientRustPanicError): THandledError => {
    const message = "A critical database engine error occurred";
    return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message,
        errorSources: [{ path: "", message }],
    };
};

// 5. PrismaClientUnknownRequestError — DB error Prisma couldn't classify
const handlePrismaUnknownErr = (err: Prisma.PrismaClientUnknownRequestError): THandledError => {
    const message = "An unknown database error occurred";
    return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message,
        errorSources: [{ path: "", message }],
    };
};

const globalErrHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {

    console.log("->>>>>>Hello from global err handler->>>>>>");

    let statusCode = err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
    let message = err.message || 'Internal Server Error';
    let errorSources: TErrorSource[] = [
        {
            path: "",
            message: err.message || "Internal Server Error"
        }
    ]
    if (err instanceof ZodError) {
        const ourErr = handleZodErr(err);
        ({ statusCode, message, errorSources } = ourErr);
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        const ourErr = handlePrismaKnownErr(err);
        ({ statusCode, message, errorSources } = ourErr);
    } else if (err instanceof Prisma.PrismaClientValidationError) {
        const ourErr = handlePrismaValidationErr(err);
        ({ statusCode, message, errorSources } = ourErr);
    } else if (err instanceof Prisma.PrismaClientInitializationError) {
        const ourErr = handlePrismaInitErr(err);
        ({ statusCode, message, errorSources } = ourErr);
    } else if (err instanceof Prisma.PrismaClientRustPanicError) {
        const ourErr = handlePrismaPanicErr(err);
        ({ statusCode, message, errorSources } = ourErr);
    } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        const ourErr = handlePrismaUnknownErr(err);
        ({ statusCode, message, errorSources } = ourErr);
    }



    res.status(statusCode).send({
        success: false,
        message,
        errorSources,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
};

export { notFoundErrHandler, globalErrHandler }