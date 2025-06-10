import { Module } from '@nestjs/common';
import { FilesStatsService } from './files-stats.service';

@Module({
  providers: [FilesStatsService]
})
export class FilesStatsModule {}
