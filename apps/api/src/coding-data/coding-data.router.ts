import { CodingDataDto, TimeOffsetDto } from "./coding-data.dto";
import { CodingDataService } from "./coding-data.service";
import { Injectable } from "@nestjs/common";
import { TrpcService } from "src/trpc/trpc.service";

@Injectable()
export class CodingDataRouter {
  constructor(
    private readonly trpcService: TrpcService,
    private readonly codingDataService: CodingDataService,
  ) {}
  apply() {
    return {
      codingDataRouter: this.trpcService.trpc.router({
        upsert: this.trpcService
          .protectedProcedure()
          .input(CodingDataDto)
          .mutation(async ({ ctx, input }) =>
            this.codingDataService.upsert({
              id: ctx.user.sub,
              updateCodingDataDto: input,
            }),
          ),

        getDailyStats: this.trpcService
          .protectedProcedure()
          .input(TimeOffsetDto)
          .query(async ({ ctx, input }) =>
            this.codingDataService.findDaily({
              offset: input,
              userId: ctx.user.sub,
            }),
          ),

        getWeeklyStats: this.trpcService
          .protectedProcedure()
          .input(TimeOffsetDto)
          .query(async ({ ctx, input }) =>
            this.codingDataService.findWeekly({
              userId: ctx.user.sub,
              offset: input,
            }),
          ),
      }),
    };
  }
}
