import * as schema from "./schema/users";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { ConfigService } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { Pool } from "pg";
export const DRIZZLE_ASYNC_PROVIDER = "drizzleProvider";

@Module({
  providers: [
    {
      provide: DRIZZLE_ASYNC_PROVIDER,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const connectionString = configService.get<string>("DATABASE_URL");
        const pool = new Pool({
          connectionString,
        });
        return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
      },
    },
  ],
  exports: [DRIZZLE_ASYNC_PROVIDER],
})
export class DrizzleModule {}
