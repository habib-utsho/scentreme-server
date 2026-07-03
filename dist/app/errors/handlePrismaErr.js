"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePrismaUnknownErr = exports.handlePrismaPanicErr = exports.handlePrismaInitErr = exports.handlePrismaValidationErr = exports.handlePrismaKnownErr = void 0;
const http_status_codes_1 = require("http-status-codes");
// 1. PrismaClientKnownRequestError — has err.code, the most common case
const handlePrismaKnownErr = (err) => {
    let statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
    let message = "Database operation failed";
    let errorSources = [];
    console.error("Prisma known error:", {
        name: err.name,
        code: err.code,
        message: err.message,
        meta: JSON.stringify(err.meta),
    });
    // Extracts the affected field(s) as a string[] regardless of which
    // Prisma error shape (classic engine vs driver adapter) produced it.
    const extractTargetFields = (meta) => {
        if (!meta || typeof meta !== "object")
            return [];
        const m = meta;
        if (Array.isArray(m.target))
            return m.target;
        if (typeof m.target === "string")
            return [m.target];
        const adapterFields = m.driverAdapterError?.cause?.constraint?.fields;
        if (Array.isArray(adapterFields))
            return adapterFields;
        return [];
    };
    switch (err.code) {
        case "P2002": {
            statusCode = http_status_codes_1.StatusCodes.CONFLICT;
            let fields = extractTargetFields(err.meta);
            if (fields.length === 0) {
                const match = err.message.match(/fields:\s*\(`([^)]+)`\)/);
                if (match?.[1])
                    fields = match[1].split(",").map((f) => f.trim());
            }
            if (fields.length > 0) {
                message = `Duplicate value for field(s): ${fields.join(", ")}`;
                errorSources = fields.map((field) => ({
                    path: field,
                    message: `${field} already exists`,
                }));
            }
            else {
                message = "Duplicate value entered for a unique field";
                errorSources = [{ path: "", message }];
            }
            break;
        }
        case "P2025":
            statusCode = http_status_codes_1.StatusCodes.NOT_FOUND;
            message = "The requested record was not found";
            errorSources = [{ path: "", message }];
            break;
        case "P2003": {
            statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
            const fields = extractTargetFields(err.meta);
            const field = err.meta?.field_name ?? fields[0];
            message = `Invalid reference${field ? ` for field: ${field}` : ""} (foreign key constraint failed)`;
            errorSources = field
                ? [{ path: field, message: `Invalid reference for ${field}` }]
                : [{ path: "", message }];
            break;
        }
        case "P2014":
            statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
            message = "The change would violate a required relation";
            errorSources = [{ path: "", message }];
            break;
        case "P2011": {
            statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
            const fields = extractTargetFields(err.meta);
            message = `Null value not allowed for field(s): ${fields.join(", ") || "unknown"}`;
            errorSources =
                fields.length > 0
                    ? fields.map((field) => ({ path: field, message: `${field} cannot be null` }))
                    : [{ path: "", message }];
            break;
        }
        case "P2000":
            statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
            message = "Provided value is too long for the column";
            errorSources = [{ path: "", message }];
            break;
        default:
            console.error(`Unhandled Prisma error code: ${err.code}`, err.message);
            errorSources = [{ path: "", message }];
    }
    return { statusCode, message, errorSources };
};
exports.handlePrismaKnownErr = handlePrismaKnownErr;
// 2. PrismaClientValidationError — Prisma client called with bad shape/types
const handlePrismaValidationErr = (err) => {
    // Try to pull out the specific "Argument `x`: ..." line, which is the
    // most useful part of Prisma's message.
    const argumentMatch = err.message.match(/Argument `(\w+)`: (.+)/);
    // Try to pull out "Expected X, provided Y" for an even tighter message
    const typeMatch = err.message.match(/Expected (\w+), provided (\w+)/);
    let path = undefined;
    let message = "Invalid data passed to database query";
    if (argumentMatch) {
        path = argumentMatch[1];
        message = typeMatch
            ? `Invalid value for field "${path}": expected ${typeMatch[1]}, got ${typeMatch[2]}`
            : `Invalid value for field "${path}": ${argumentMatch[2]?.split("\n")[0]?.trim()}`;
    }
    return {
        statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
        message,
        errorSources: [{ path, message }],
    };
};
exports.handlePrismaValidationErr = handlePrismaValidationErr;
// 3. PrismaClientInitializationError — can't connect to DB
const handlePrismaInitErr = (err) => {
    const message = "Could not connect to the database";
    return {
        statusCode: http_status_codes_1.StatusCodes.SERVICE_UNAVAILABLE, // 503, not 500 — it's a dependency outage
        message,
        errorSources: [{ path: "", message }],
    };
};
exports.handlePrismaInitErr = handlePrismaInitErr;
// 4. PrismaClientRustPanicError — engine crashed, treat as fatal
const handlePrismaPanicErr = (err) => {
    const message = "A critical database engine error occurred";
    return {
        statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
        message,
        errorSources: [{ path: "", message }],
    };
};
exports.handlePrismaPanicErr = handlePrismaPanicErr;
// 5. PrismaClientUnknownRequestError — DB error Prisma couldn't classify
const handlePrismaUnknownErr = (err) => {
    const message = "An unknown database error occurred";
    return {
        statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
        message,
        errorSources: [{ path: "", message }],
    };
};
exports.handlePrismaUnknownErr = handlePrismaUnknownErr;
//# sourceMappingURL=handlePrismaErr.js.map