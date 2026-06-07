import "dotenv/config";
import { defineConfig } from "prisma/config";

const generateOnlyUrl =
  "postgresql://invalid:invalid@127.0.0.1:1/foobow?schema=public";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations"
  },
  datasource: {
    // Allows `prisma generate` in CI without a live database. Real migrations
    // must set DATABASE_URL to a reachable PostgreSQL instance.
    url: process.env.DATABASE_URL ?? generateOnlyUrl
  }
});
