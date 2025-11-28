import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrations: {
    // This is where DATABASE_URL goes now
    connectionString: process.env.DATABASE_URL!,
  },
});
