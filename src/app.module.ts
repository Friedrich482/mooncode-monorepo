import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { DrizzleModule } from "./drizzle/drizzle.module";
import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { CodingDataModule } from './coding-data/coding-data.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
    UsersModule,
    AuthModule,
    DrizzleModule,
    CodingDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
