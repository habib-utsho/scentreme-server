import { TUser } from "./user.interface";
import { TOptions } from "../../interface";
export declare const userServices: {
    createUser: (payload: TUser) => Promise<{
        user: {
            email: string;
            status: import("../../../generated/prisma/enums").UserStatus;
            role_id: string;
            id: string;
            password: string;
            last_login_at: Date | null;
            failed_login_attempts: number;
            locked_until: Date | null;
            needsPasswordChange: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            user_id: string;
            phone: string | null;
            date_of_birth: Date | null;
            avatar_url: string | null;
            gender: import("../../../generated/prisma/enums").Gender | null;
            isDeleted: boolean;
        };
    }>;
    getUsers: (query: Record<string, unknown>, options: TOptions) => Promise<{
        result: ({
            role: {
                id: string;
                createdAt: Date;
                name: string;
                description: string | null;
            };
            profile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string | null;
                user_id: string;
                phone: string | null;
                date_of_birth: Date | null;
                avatar_url: string | null;
                gender: import("../../../generated/prisma/enums").Gender | null;
                isDeleted: boolean;
            } | null;
        } & {
            email: string;
            status: import("../../../generated/prisma/enums").UserStatus;
            role_id: string;
            id: string;
            password: string;
            last_login_at: Date | null;
            failed_login_attempts: number;
            locked_until: Date | null;
            needsPasswordChange: boolean;
            createdAt: Date;
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
            createdAt: Date;
            name: string;
            description: string | null;
        };
    } & {
        email: string;
        status: import("../../../generated/prisma/enums").UserStatus;
        role_id: string;
        id: string;
        password: string;
        last_login_at: Date | null;
        failed_login_attempts: number;
        locked_until: Date | null;
        needsPasswordChange: boolean;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
};
//# sourceMappingURL=user.service.d.ts.map