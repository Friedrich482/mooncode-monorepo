import { Injectable } from "@nestjs/common";
import { UpsertFilesStatsDtoType } from "./files-stats.dto";

@Injectable()
export class FilesStatsService {
  async getFilesStatsForExtension({}) {}

  async upsert(upsertFilesDto: UpsertFilesStatsDtoType): Promise<void> {
    // TODO: Implement upsert logic
  }
}
