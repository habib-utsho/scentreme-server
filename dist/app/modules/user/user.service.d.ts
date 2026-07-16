import { TUser } from "./user.interface";
import { TOptions } from "../../interface";
export declare const userServices: {
    createUser: (payload: TUser, file: any) => Promise<{
        user: {
            email: string;
            status: import("../../../generated/prisma/enums").UserStatus;
            role_id: string;
            id: string;
            createdAt: Date;
            password: string;
            last_login_at: Date | null;
            failed_login_attempts: number;
            locked_until: Date | null;
            needsPasswordChange: boolean;
            updatedAt: Date;
        };
        profile: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            date_of_birth: Date | null;
            avatar_url: string | null;
            gender: import("../../../generated/prisma/enums").Gender | null;
            isDeleted: boolean;
            user_id: string;
        };
    }>;
    getUsers: (query: Record<string, unknown>, options: TOptions) => Promise<{
        result: ({
            role: {
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
            };
            profile: {
                id: string;
                name: string | null;
                createdAt: Date;
                updatedAt: Date;
                phone: string | null;
                date_of_birth: Date | null;
                avatar_url: string | null;
                gender: import("../../../generated/prisma/enums").Gender | null;
                isDeleted: boolean;
                user_id: string;
            } | null;
        } & {
            email: string;
            status: import("../../../generated/prisma/enums").UserStatus;
            role_id: string;
            id: string;
            createdAt: Date;
            last_login_at: Date | null;
            failed_login_attempts: number;
            locked_until: Date | null;
            needsPasswordChange: boolean;
            updatedAt: Date;
        })[];
        meta: {
            total: number;
            limit: number;
            page: number;
            totalPage: number;
        };
    }>;
    getUserById: (id: string) => Promise<({
        role: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
        };
    } & {
        email: string;
        status: import("../../../generated/prisma/enums").UserStatus;
        role_id: string;
        id: string;
        createdAt: Date;
        password: string;
        last_login_at: Date | null;
        failed_login_attempts: number;
        locked_until: Date | null;
        needsPasswordChange: boolean;
        updatedAt: Date;
    }) | null>;
};
//# sourceMappingURL=user.service.d.ts.map