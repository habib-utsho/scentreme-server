export type TUser = {
    id: string;
    email: string;
    password: string;
    name: string;
    phone: string;
    date_of_birth: string;
    gender: "Male" | "Female" | "Other";
    role: "admin" | "moderator" | "customer";
    avatar_url: string | null;
    status: "active" | "inactive";
    last_login_at: Date | null;
    failed_login_attempts: number;
    locked_until: Date | null;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}