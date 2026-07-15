import { TLoginUser, TPasswordUpdate, TResetPassword } from "./auth.interface";
import { UserStatus } from "../../../generated/prisma/enums";
import { JwtPayload } from "jsonwebtoken";
export declare const authServices: {
    login: (payload: TLoginUser) => Promise<{
        accessToken: any;
        refreshToken: any;
        data: {
            email: string;
            status: UserStatus;
            role_id: string;
            id: string;
            last_login_at: Date | null;
            failed_login_attempts: number;
            locked_until: Date | null;
            needsPasswordChange: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        needsPasswordChange: boolean;
    }>;
    refreshToken: (token: string) => Promise<{
        accessToken: any;
    }>;
    forgetPassword: (payload: Record<string, unknown>) => Promise<{
        resetLink: string;
    }>;
    resetPassword: (payload: TResetPassword, jwtPayload: JwtPayload) => Promise<{
        email: string;
        status: UserStatus;
        role_id: string;
        id: string;
        password: string;
        last_login_at: Date | null;
        failed_login_attempts: number;
        locked_until: Date | null;
        needsPasswordChange: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    changePassword: (userPayload: JwtPayload, payload: TPasswordUpdate) => Promise<{
        email: string;
        status: UserStatus;
        role_id: string;
        id: string;
        password: string;
        last_login_at: Date | null;
        failed_login_attempts: number;
        locked_until: Date | null;
        needsPasswordChange: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map