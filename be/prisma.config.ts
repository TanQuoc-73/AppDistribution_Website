import path from 'node:path';
import { defineConfig } from 'prisma/config';

export default defineConfig({
    schema: path.join('prisma', 'schema.prisma'),
    datasource: {
        // Use Supabase (or any Postgres) via DATABASE_URL only
        url: process.env.DATABASE_URL!,
    },
});
