import { Prisma } from "../../generated/prisma/client";
import { TErrorSource } from "../interface/error";
type THandledError = {
    statusCode: number;
    message: string;
    errorSources: TErrorSource[];
};
declare const handlePrismaKnownErr: (err: Prisma.PrismaClientKnownRequestError) => THandledError;
declare const handlePrismaValidationErr: (err: Prisma.PrismaClientValidationError) => THandledError;
declare const handlePrismaInitErr: (err: Prisma.PrismaClientInitializationError) => THandledError;
declare const handlePrismaPanicErr: (err: Prisma.PrismaClientRustPanicError) => THandledError;
declare const handlePrismaUnknownErr: (err: Prisma.PrismaClientUnknownRequestError) => THandledError;
export { handlePrismaKnownErr, handlePrismaValidationErr, handlePrismaInitErr, handlePrismaPanicErr, handlePrismaUnknownErr };
//# sourceMappingURL=handlePrismaErr.d.ts.map