import { Module } from '@nestjs/common';
import { DailyDataService } from './daily-data.service';
import { DailyDataController } from './daily-data.controller';

@Module({
  controllers: [DailyDataController],
  providers: [DailyDataService],
})
export class DailyDataModule {}
