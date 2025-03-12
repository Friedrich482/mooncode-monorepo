import { Global, Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { CodingDataModule } from "src/coding-data/coding-data.module";
import { DailyDataModule } from "src/daily-data/daily-data.module";
import { JwtService } from "@nestjs/jwt";
import { LanguagesModule } from "src/languages/languages.module";
import { TrpcRouter } from "./trpc.router";
import { TrpcService } from "./trpc.service";
import { UsersModule } from "src/users/users.module";

@Global()
@Module({
  imports: [
    UsersModule,
    DailyDataModule,
    CodingDataModule,
    LanguagesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [TrpcService, TrpcRouter, JwtService],
  exports: [TrpcService],
})
export class TrpcModule {}
