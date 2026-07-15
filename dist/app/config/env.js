"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
exports.env = zod_1.default.object({
    NODE_ENV: zod_1.default.enum(["development", "production"]).default("development"),
    PORT: zod_1.default.coerce.number().default(3000),
    DATABASE_URL: zod_1.default.string(),
    JWT_ACCESS_SECRET: zod_1.default.string(),
    JWT_REFRESH_SECRET: zod_1.default.string(),
    JWT_ACCESS_EXPIRES_IN: zod_1.default.string(),
    JWT_REFRESH_EXPIRES_IN: zod_1.default.string(),
    CLIENT_URL: zod_1.default.string().url(),
    APP_NAME: zod_1.default.string(),
    BREVO_API_KEY: zod_1.default.string(),
    BREVO_SENDER_EMAIL: zod_1.default.string().email(),
}).parse(process.env);
//# sourceMappingURL=env.js.map