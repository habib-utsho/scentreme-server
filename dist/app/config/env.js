"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = __importDefault(require("zod"));
exports.env = zod_1.default.object({
    // Database and app configuration
    NODE_ENV: zod_1.default.enum(["development", "production"]).default("development"),
    PORT: zod_1.default.coerce.number().default(3000),
    CLIENT_URL: zod_1.default.string().url(),
    APP_NAME: zod_1.default.string(),
    DATABASE_URL: zod_1.default.string(),
    // JWT secrets and expiration times
    JWT_ACCESS_SECRET: zod_1.default.string(),
    JWT_REFRESH_SECRET: zod_1.default.string(),
    JWT_ACCESS_EXPIRES_IN: zod_1.default.string(),
    JWT_REFRESH_EXPIRES_IN: zod_1.default.string(),
    // Email service configuration
    BREVO_API_KEY: zod_1.default.string(),
    BREVO_SENDER_EMAIL: zod_1.default.string().email(),
    // Login and account lockout configuration
    MAX_LOGIN_ATTEMPTS: zod_1.default.coerce.number().default(3),
    LOCK_TIME: zod_1.default.coerce.number().default(10 * 60 * 1000), // 10 minutes in milliseconds
    SALT_ROUNDS: zod_1.default.coerce.number().default(12),
    // Cloudinary configuration
    CLOUDINARY_API_KEY: zod_1.default.string(),
    CLOUDINARY_SECRET: zod_1.default.string(),
    CLOUDINARY_CLOUD_NAME: zod_1.default.string(),
    CLOUDINARY_URL: zod_1.default.string(),
}).parse(process.env);
//# sourceMappingURL=env.js.map