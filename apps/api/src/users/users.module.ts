import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { drizzleProvider } from "src/drizzle/drizzle.provider";

@Module({
  imports: [ConfigModule, JwtModule],
  controllers: [UsersController],
  // we need to add UsersController in the providers
  // to make the adapter generate the trpc router
  providers: [...drizzleProvider, UsersService, UsersController],
  exports: [UsersService],
})
export class UsersModule {}
