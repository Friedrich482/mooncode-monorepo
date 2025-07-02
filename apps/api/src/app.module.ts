import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { CodingStatsModule } from "./coding-stats/coding-stats.module";
import { ConfigModule } from "@nestjs/config";
import { DailyDataModule } from "./daily-data/daily-data.module";
import { DrizzleModule } from "./drizzle/drizzle.module";
import { EnvModule } from "./env/env.module";
import { EnvService } from "./env/env.service";
import { FilesModule } from "./files/files.module";
import { FilesStatsModule } from "./files-stats/files-stats.module";
import { LanguagesModule } from "./languages/languages.module";
import { Module } from "@nestjs/common";
import { ProjectsModule } from "./projects/projects.module";
import { TrpcModule } from "./trpc/trpc.module";
import { UsersModule } from "./users/users.module";
import { envSchema } from "src/env";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env),
    }),
    UsersModule,
    AuthModule,
    DrizzleModule,
    CodingStatsModule,
    DailyDataModule,
    LanguagesModule,
    TrpcModule,
    EnvModule,
    FilesModule,
    ProjectsModule,
    FilesStatsModule,
  ],
  controllers: [AppController],
  providers: [AppService, EnvService],
  exports: [],
})
export class AppModule {}
