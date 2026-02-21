import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

if (!process.env.DATABASE_URL && process.env.Production_DATABASE_URL) {
    process.env.DATABASE_URL = process.env.Production_DATABASE_URL;
}
import { defineConfig, env } from "prisma/config";

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: { path: "prisma/migrations" },
    datasource: {
        url: env("DATABASE_URL"),
    },
});
