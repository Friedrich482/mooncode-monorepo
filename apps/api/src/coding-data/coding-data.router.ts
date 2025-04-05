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
  procedures = {
    codingData: this.trpcService.trpc.router({
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
          this.codingDataService.getDailyStats({
            offset: input.offset,
            userId: ctx.user.sub,
          }),
        ),

      getDailyStatsForChart: this.trpcService
        .protectedProcedure()
        .input(TimeOffsetDto)
        .query(async ({ ctx, input }) =>
          this.codingDataService.getDailyStatsForChart({
            offset: input.offset,
            userId: ctx.user.sub,
          }),
        ),

      getTimeSpentOnWeek: this.trpcService
        .protectedProcedure()
        .input(TimeOffsetDto)
        .query(async ({ ctx, input }) =>
          this.codingDataService.getTimeSpentOnWeek({
            userId: ctx.user.sub,
            offset: input.offset,
          }),
        ),

      getDaysOfWeekStats: this.trpcService
        .protectedProcedure()
        .input(TimeOffsetDto)
        .query(async ({ ctx, input }) =>
          this.codingDataService.getDaysOfWeekStats({
            userId: ctx.user.sub,
            offset: input.offset,
          }),
        ),

      getWeekLanguagesTime: this.trpcService
        .protectedProcedure()
        .input(TimeOffsetDto)
        .query(async ({ ctx, input }) =>
          this.codingDataService.getWeekLanguagesTime({
            userId: ctx.user.sub,
            offset: input.offset,
          }),
        ),

      getLanguagesWeekPerDay: this.trpcService
        .protectedProcedure()
        .input(TimeOffsetDto)
        .query(async ({ ctx, input }) =>
          this.codingDataService.getLanguagesWeekPerDay({
            userId: ctx.user.sub,
            offset: input.offset,
          }),
        ),

      getGeneralStatsPerWeek: this.trpcService
        .protectedProcedure()
        .input(TimeOffsetDto)
        .query(async ({ ctx, input }) =>
          this.codingDataService.getGeneralStatsPerWeek({
            userId: ctx.user.sub,
            offset: input.offset,
          }),
        ),
    }),
  };
}
