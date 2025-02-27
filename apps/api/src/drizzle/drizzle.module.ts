import { DrizzleAsyncProvider, drizzleProvider } from "./drizzle.provider";
import { Module } from "@nestjs/common";

@Module({
  providers: [...drizzleProvider],
  exports: [DrizzleAsyncProvider],
})
export class DrizzleModule {}
