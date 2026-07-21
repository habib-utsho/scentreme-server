export type TAddress = {
    id: string;
    user_id: string;
    fullAddress: string;
    city: string;
    area?: string | null;
    postalCode?: string | null;
    isDefault?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};
