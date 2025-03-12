import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { CodingDataModule } from "./coding-data/coding-data.module";
import { ConfigModule } from "@nestjs/config";
import { DailyDataModule } from "./daily-data/daily-data.module";
import { DrizzleModule } from "./drizzle/drizzle.module";
import { LanguagesModule } from "./languages/languages.module";
import { Module } from "@nestjs/common";
import { TrpcModule } from "./trpc/trpc.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
    UsersModule,
    AuthModule,
    DrizzleModule,
    CodingDataModule,
    DailyDataModule,
    LanguagesModule,
    TrpcModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
