import { ZodError, ZodIssue } from "zod";
import { TGenericErrorResponse } from "../interface/error";
import { StatusCodes } from "http-status-codes";

const handleZodErr = (error: ZodError): TGenericErrorResponse => {
    const statusCode = StatusCodes.BAD_REQUEST;
    const message = "Validation failed";
    const errorSources = error.issues.map((issue: ZodIssue) => ({
        // path: issue.path?.[issue?.path?.length - 1],
        path: issue.path.join("."),
        message: issue.message
    }));

    return {
        statusCode,
        message,
        errorSources
    };
}

export default handleZodErr;