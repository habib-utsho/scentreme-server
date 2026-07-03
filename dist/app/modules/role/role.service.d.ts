export declare const roleServices: {
    createRole: (payload: any) => Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
    }>;
    getRoles: (query: any) => Promise<{
        result: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            totalPage: number;
            limit: number;
        };
    }>;
};
//# sourceMappingURL=role.service.d.ts.map