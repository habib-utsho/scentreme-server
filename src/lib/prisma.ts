import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter, log: ['query', 'info', 'warn', 'error'] });

// prisma.$on('query', (e: any) => {
//     console.log('Query: ' + e.query);
//     console.log('Params: ' + e.params);
//     console.log('Duration: ' + e.duration + 'ms');
// });

export { prisma };