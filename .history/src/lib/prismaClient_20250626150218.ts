import { PrismaClient } from '@prisma/client';
console.log(PrismaClientModule);  // ← これを一時的に追加

const prisma = new PrismaClient();

export default prisma;
