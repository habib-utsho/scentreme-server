import z from "zod";
export declare const updateProfileZodSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    date_of_birth: z.ZodOptional<z.ZodString>;
    gender: z.ZodOptional<z.ZodEnum<{
        Men: "Men";
        Women: "Women";
        Unisex: "Unisex";
    }>>;
}, z.core.$strip>;
//# sourceMappingURL=profile.validation.d.ts.map