import z from "zod";

export const updateProfileZodSchema = z.object({
    name: z.string().min(5, "Name must be at least 5 characters long").optional(),
    phone: z.string().min(10, "Phone number must be at least 10 digits long").optional(),
    date_of_birth: z.string().refine((date) => {
        const parsedDate = Date.parse(date);
        return !isNaN(parsedDate);
    }, "Invalid date format, expected a valid date string").optional(),
    gender: z.enum(["Men", "Women", "Unisex"], "Gender must be 'Men', 'Women', or 'Unisex'").optional(),
});
