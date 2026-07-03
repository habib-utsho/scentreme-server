"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleServices = void 0;
const prisma_1 = require("../../../lib/prisma");
const createRole = async (payload) => {
    console.log(payload, 'payload');
    const result = prisma_1.prisma.role.create({
        data: { ...payload, createdAt: new Date() }
    });
    return result;
};
const getRoles = async (query) => {
    const parsedQuery = {};
    if (query.searchTerm) {
        parsedQuery.OR = [
            { name: { contains: query.searchTerm, mode: 'insensitive' } },
            { description: { contains: query.searchTerm, mode: 'insensitive' } }
        ];
    }
    const filterableFields = ['name', 'description'];
    filterableFields.forEach(field => {
        if (query[field]) {
            parsedQuery[field] = query[field];
        }
    });
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.max(1, parseInt(query.limit) || 10);
    const skip = (page - 1) * limit;
    const [total, result] = await Promise.all([
        prisma_1.prisma.role.count({
            where: parsedQuery
        }),
        prisma_1.prisma.role.findMany({
            where: parsedQuery,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' }
        })
    ]);
    return { result, meta: { total, page, totalPage: Math.ceil(total / limit), limit } };
};
exports.roleServices = { createRole, getRoles };
//# sourceMappingURL=role.service.js.map