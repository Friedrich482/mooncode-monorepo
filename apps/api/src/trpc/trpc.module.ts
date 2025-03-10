import { Global, Module } from "@nestjs/common";
import { CodingDataModule } from "src/coding-data/coding-data.module";
import { DailyDataModule } from "src/daily-data/daily-data.module";
import { LanguagesModule } from "src/languages/languages.module";
import { UsersModule } from "src/users/users.module";

@Global()
@Module({
  imports: [UsersModule, DailyDataModule, CodingDataModule, LanguagesModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class TrpcModule {}
