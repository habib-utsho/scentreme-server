import { TUser } from "../user/user.interface";
import { UserStatus } from "../../../generated/prisma/enums";
import { User } from "../../../generated/prisma/client";
export declare const profileServices: {
    getMe: (id: string) => Promise<User | null>;
    updateProfile: (user_id: string, payload: Partial<TUser>) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        phone: string | null;
        date_of_birth: Date | null;
        avatar_url: string | null;
        gender: import("../../../generated/prisma/enums").Gender | null;
        isDeleted: boolean;
        user_id: string;
    }>;
    deleteProfile: (user_id: string) => Promise<{
        profileDelete: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            phone: string | null;
            date_of_birth: Date | null;
            avatar_url: string | null;
            gender: import("../../../generated/prisma/enums").Gender | null;
            isDeleted: boolean;
            user_id: string;
        };
        userDelete: {
            email: string;
            status: UserStatus;
            role_id: string;
            id: string;
            createdAt: Date;
            password: string;
            last_login_at: Date | null;
            failed_login_attempts: number;
            locked_until: Date | null;
            updatedAt: Date;
        };
    }>;
};
//# sourceMappingURL=profile.service.d.ts.map