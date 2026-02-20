import * as dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// Load from .env (Next.js convention)
dotenv.config({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"]!,
  },
});
