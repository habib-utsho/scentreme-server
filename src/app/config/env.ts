import z from "zod";


export const env = z.object({
    // Database and app configuration
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    PORT: z.coerce.number().default(3000),
    CLIENT_URL: z.string().url(),
    APP_NAME: z.string(),
    DATABASE_URL: z.string(),

    // JWT secrets and expiration times
    JWT_ACCESS_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    JWT_ACCESS_EXPIRES_IN: z.string(),
    JWT_REFRESH_EXPIRES_IN: z.string(),

    // Email service configuration
    BREVO_API_KEY: z.string(),
    BREVO_SENDER_EMAIL: z.string().email(),

    // Login and account lockout configuration
    MAX_LOGIN_ATTEMPTS: z.coerce.number().default(3),
    LOCK_TIME: z.coerce.number().default(10 * 60 * 1000),
    SALT_ROUNDS: z.coerce.number().default(12),

    // Cloudinary configuration
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_SECRET: z.string(),
    CLOUDINARY_CLOUD_NAME: z.string(),
    CLOUDINARY_URL: z.string(),

}).parse(process.env);