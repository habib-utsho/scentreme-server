"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zodValidateHandler = (schema) => {
    // const zodValidateHandler = (schema: ZodObject<any>) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync(req.body);
            next();
        }
        catch (e) {
            next(e);
        }
    };
};
exports.default = zodValidateHandler;
//# sourceMappingURL=zodValidateHandler.js.map