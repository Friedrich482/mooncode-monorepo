import * as schema from "./schema/users";
import { EnvService } from "src/env/env.service";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

export const DrizzleAsyncProvider = "DrizzleAsyncProvider";

export const drizzleProvider = [
  {
    provide: DrizzleAsyncProvider,
    inject: [EnvService],
    useFactory: async (envService: EnvService) => {
      const connectionString = envService.get("DATABASE_URL");
      const pool = new Pool({
        connectionString,
      });

      return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
    },
  },
];
