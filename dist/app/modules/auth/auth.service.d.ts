import { TLoginUser, TPasswordUpdate, TResetPassword } from "./auth.interface";
import { UserStatus } from "../../../generated/prisma/enums";
import { JwtPayload } from "jsonwebtoken";
export declare const authServices: {
    login: (payload: TLoginUser) => Promise<{
        accessToken: string;
        refreshToken: string;
        data: {
            email: string;
            status: UserStatus;
            role_id: string;
            id: string;
            createdAt: Date;
            last_login_at: Date | null;
            failed_login_attempts: number;
            locked_until: Date | null;
            needsPasswordChange: boolean;
            updatedAt: Date;
        };
        needsPasswordChange: boolean;
    }>;
    refreshToken: (token: string) => Promise<{
        accessToken: string;
    }>;
    forgetPassword: (payload: Record<string, unknown>) => Promise<{
        resetLink: string;
    }>;
    resetPassword: (payload: TResetPassword, jwtPayload: JwtPayload) => Promise<{
        email: string;
        status: UserStatus;
        role_id: string;
        id: string;
        createdAt: Date;
        password: string;
        last_login_at: Date | null;
        failed_login_attempts: number;
        locked_until: Date | null;
        needsPasswordChange: boolean;
        updatedAt: Date;
    }>;
    changePassword: (userPayload: JwtPayload, payload: TPasswordUpdate) => Promise<{
        email: string;
        status: UserStatus;
        role_id: string;
        id: string;
        createdAt: Date;
        password: string;
        last_login_at: Date | null;
        failed_login_attempts: number;
        locked_until: Date | null;
        needsPasswordChange: boolean;
        updatedAt: Date;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map