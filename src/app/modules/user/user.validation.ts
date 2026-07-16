import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

export const createCustomerZodSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    name: z.string().min(5, "Name must be at least 5 characters long"),
    phone: z.string().min(10, "Phone number must be at least 10 digits long"),
    date_of_birth: z.string().refine((date) => {
        const parsedDate = Date.parse(date);
        return !isNaN(parsedDate);
    }, "Invalid date format, expected a valid date string"),
    gender: z.enum([Gender.Male, Gender.Female, Gender.Other], "Gender must be one of: Male, Female, or Other"),
    role: z.enum(["customer"], "Role must be 'customer'").optional(),
    status: z.enum(["active", "inactive"], "Status must be 'active' or 'inactive'").optional(),
});

export const createAdminModeratorZodSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    name: z.string().min(5, "Name must be at least 5 characters long"),
    phone: z.string().min(10, "Phone number must be at least 10 digits long"),
    date_of_birth: z.string().refine((date) => {
        const parsedDate = Date.parse(date);
        return !isNaN(parsedDate);
    }, "Invalid date format, expected a valid date string"),
    gender: z.enum([Gender.Male, Gender.Female, Gender.Other], "Gender must be one of: Male, Female, or Other"),
    role: z.enum(["admin", "moderator"], "Role must be 'admin' or 'moderator'").optional(),
    status: z.enum(["active", "inactive"], "Status must be 'active' or 'inactive'").optional(),
});



