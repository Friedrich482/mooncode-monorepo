import { Module } from '@nestjs/common';
import { CodingDataService } from './coding-data.service';
import { CodingDataController } from './coding-data.controller';

@Module({
  controllers: [CodingDataController],
  providers: [CodingDataService],
})
export class CodingDataModule {}
