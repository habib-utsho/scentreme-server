import z from "zod";

export const createAddressZodSchema = z.object({
    fullAddress: z.string().min(5, "Full address must be at least 5 characters long"),
    city: z.string().min(2, "City must be at least 2 characters long"),
    area: z.string().min(2, "Area must be at least 2 characters long").optional(),
    postalCode: z.string().min(3, "Postal code must be at least 3 characters long").optional(),
    isDefault: z.boolean().optional(),
});

export const updateAddressZodSchema = z.object({
    fullAddress: z.string().min(5, "Full address must be at least 5 characters long").optional(),
    city: z.string().min(2, "City must be at least 2 characters long").optional(),
    area: z.string().min(2, "Area must be at least 2 characters long").optional(),
    postalCode: z.string().min(3, "Postal code must be at least 3 characters long").optional(),
    isDefault: z.boolean().optional(),
});
