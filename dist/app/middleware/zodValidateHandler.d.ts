import { NextFunction, Request, Response } from 'express';
import { ZodObject } from 'zod';
declare const zodValidateHandler: (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default zodValidateHandler;
//# sourceMappingURL=zodValidateHandler.d.ts.map