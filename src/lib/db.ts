import { PrismaClient } from "@prisma/client";
import { postgres } from "@prisma/adapter-postgresql";

const adapter = postgres();

export const db = new PrismaClient({
  adapter,
});
