import { DrizzleAsyncProvider, drizzleProvider } from "./drizzle.provider";
import { EnvService } from "src/env/env.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [...drizzleProvider, EnvService],
  exports: [DrizzleAsyncProvider],
})
export class DrizzleModule {}
