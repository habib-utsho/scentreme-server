import { z } from 'zod';
export declare const authZodSchema: {
    signinZodSchema: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, z.core.$strip>;
    forgetPasswordZodSchema: z.ZodObject<{
        email: z.ZodString;
    }, z.core.$strip>;
    changePasswordZodSchema: z.ZodObject<{
        oldPassword: z.ZodString;
        newPassword: z.ZodString;
    }, z.core.$strip>;
    resetPasswordZodSchema: z.ZodObject<{
        email: z.ZodString;
        newPassword: z.ZodString;
    }, z.core.$strip>;
};
//# sourceMappingURL=auth.validation.d.ts.map