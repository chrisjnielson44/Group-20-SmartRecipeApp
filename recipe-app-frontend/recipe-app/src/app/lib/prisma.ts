import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    return new PrismaClient();
};

type PrismaJsonValue = Parameters<
    PrismaClient["message"]["create"]
>[0]["data"]["chart"];

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export type { PrismaJsonValue }; // Export the type
export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
