import { prisma } from "../../../lib/prisma";


const createUser = async (payload: any) => {
    // Expect payload to contain user fields and optional profile object

    const role = payload.role_id ? await prisma.role.findUnique({ where: { id: payload.role_id } }) : await prisma.role.findUnique({ where: { name: 'customer' } });
    if (!role) {
        throw new Error('Invalid role_id provided');
    }

    const userData = {
        email: payload.email,
        password: payload.password,
        role_id: role.id,
        status: payload.status || 'active',
        last_login_at: null,
        failed_login_attempts: 0,
        locked_until: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: payload.isDeleted || false
    }
    const profile = {
        firstName: payload.first_name,
        lastName: payload.last_name,
        phone: payload.phone,
        date_of_birth: payload.date_of_birth ? new Date(payload.date_of_birth) : null,
        avatar_url: payload.avatar_url,
        gender: payload.gender,
        createdAt: new Date(),
        updatedAt: new Date()
    }


    const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: userData
        });

        const createdProfile = await tx.profile.create({
            data: {
                ...profile,
                user_id: user.id
            }
        });

        return { user, profile: createdProfile };
    });

    return result;
}
const getUsers = async (query: any) => {

    const parsedQuery: any = {};
    if (query.searchTerm) {
        parsedQuery.OR = [
            { email: { contains: query.searchTerm, mode: 'insensitive' } },
        ]
    }

    const filterableFields = ['status', 'role_id'];
    filterableFields.forEach(field => {
        if (query[field]) {
            parsedQuery[field] = query[field];
        }
    })

    const page = Math.max(1, parseInt(query.page as string) || 1);
    const limit = Math.max(1, parseInt(query.limit as string) || 10);
    const skip = (page - 1) * limit;


    const [total, result] = await Promise.all([
        prisma.user.count({
            where: parsedQuery,
        }),
        prisma.user.findMany({
            where: parsedQuery,
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                role: true
            }
        }),
    ]);
    return { result, meta: { total, page, totalPage: Math.ceil(total / limit), limit } };
}

export const userServices = { createUser, getUsers }