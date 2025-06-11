import { FilesStatsService } from "./files-stats.service";
import { Injectable } from "@nestjs/common";
import { TrpcService } from "src/trpc/trpc.service";
import { UpsertFilesDto } from "./files-stats.dto";

@Injectable()
export class FilesStatsRouter {
  constructor(
    private readonly trpcService: TrpcService,
    private readonly filesStatsService: FilesStatsService,
  ) {}

  procedures = {
    filesStats: this.trpcService.trpc.router({
      upsert: this.trpcService
        .protectedProcedure()
        .input(UpsertFilesDto)
        .mutation(async ({ ctx, input }) =>
          this.filesStatsService.upsert({
            userId: ctx.user.sub,
            upsertFilesDto: input,
          }),
        ),
    }),
  };
}
