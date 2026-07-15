export declare const roleServices: {
    createRole: (payload: any) => Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
    }>;
    getRoles: (query: any) => Promise<{
        result: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
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