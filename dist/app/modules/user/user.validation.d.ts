import z from "zod";
export declare const createUserZodSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    first_name: z.ZodString;
    last_name: z.ZodString;
    phone: z.ZodString;
    date_of_birth: z.ZodString;
    gender: z.ZodEnum<{
        Men: "Men";
        Women: "Women";
        Unisex: "Unisex";
    }>;
    role_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodEnum<{
        active: "active";
        inactive: "inactive";
    }>>;
}, z.core.$strip>;
//# sourceMappingURL=user.validation.d.ts.map