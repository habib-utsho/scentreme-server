import z from "zod";


export const env = z.object({
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string(),
    JWT_ACCESS_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    JWT_ACCESS_EXPIRES_IN: z.string(),
    JWT_REFRESH_EXPIRES_IN: z.string(),
    CLIENT_URL: z.string().url(),
    APP_NAME: z.string(),
    BREVO_API_KEY: z.string(),
    BREVO_SENDER_EMAIL: z.string().email(),
}).parse(process.env);