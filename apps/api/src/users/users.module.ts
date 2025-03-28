import { ConfigModule } from "@nestjs/config";
import { EnvService } from "src/env/env.service";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { TrpcService } from "src/trpc/trpc.service";
import { UsersRouter } from "./users.router";
import { UsersService } from "./users.service";
import { drizzleProvider } from "src/drizzle/drizzle.provider";

@Module({
  imports: [ConfigModule, JwtModule],
  providers: [
    ...drizzleProvider,
    UsersService,
    UsersRouter,
    TrpcService,
    EnvService,
  ],
  exports: [UsersService, UsersRouter],
})
export class UsersModule {}
