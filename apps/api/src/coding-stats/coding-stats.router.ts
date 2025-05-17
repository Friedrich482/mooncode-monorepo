import { DatesDto, DayStatsDto, UpsertLanguagesDto } from "./coding-stats.dto";
import { CodingStatsService } from "./coding-stats.service";
import { Injectable } from "@nestjs/common";
import { TrpcService } from "src/trpc/trpc.service";

@Injectable()
export class CodingStatsRouter {
  constructor(
    private readonly trpcService: TrpcService,
    private readonly codingStatsService: CodingStatsService,
  ) {}
  procedures = {
    codingStats: this.trpcService.trpc.router({
      upsert: this.trpcService
        .protectedProcedure()
        .input(UpsertLanguagesDto)
        .mutation(async ({ ctx, input }) =>
          this.codingStatsService.upsert({
            id: ctx.user.sub,
            upsertLanguagesDto: input,
          }),
        ),

      getDailyStatsForExtension: this.trpcService
        .protectedProcedure()
        .input(DayStatsDto)
        .query(async ({ ctx, input }) =>
          this.codingStatsService.getDailyStatsForExtension({
            dateString: input.dateString,
            userId: ctx.user.sub,
          }),
        ),

      getDailyStatsForChart: this.trpcService
        .protectedProcedure()
        .input(DayStatsDto)
        .query(async ({ ctx, input }) =>
          this.codingStatsService.getDailyStatsForChart({
            dateString: input.dateString,
            userId: ctx.user.sub,
          }),
        ),

      getTimeSpentOnPeriod: this.trpcService
        .protectedProcedure()
        .input(DatesDto)
        .query(async ({ ctx, input }) =>
          this.codingStatsService.getTimeSpentOnPeriod({
            userId: ctx.user.sub,
            start: input.start,
            end: input.end,
          }),
        ),

      getDaysOfPeriodStats: this.trpcService
        .protectedProcedure()
        .input(DatesDto)
        .query(async ({ ctx, input }) =>
          this.codingStatsService.getDaysOfPeriodStats({
            userId: ctx.user.sub,
            start: input.start,
            end: input.end,
            groupBy: input.groupBy,
            periodResolution: input.periodResolution,
          }),
        ),

      getPeriodLanguagesTime: this.trpcService
        .protectedProcedure()
        .input(DatesDto)
        .query(async ({ ctx, input }) =>
          this.codingStatsService.getPeriodLanguagesTime({
            userId: ctx.user.sub,
            start: input.start,
            end: input.end,
          }),
        ),

      getPeriodLanguagesPerDay: this.trpcService
        .protectedProcedure()
        .input(DatesDto)
        .query(async ({ ctx, input }) =>
          this.codingStatsService.getPeriodLanguagesPerDay({
            userId: ctx.user.sub,
            start: input.start,
            end: input.end,
            groupBy: input.groupBy,
            periodResolution: input.periodResolution,
          }),
        ),

      getPeriodGeneralStats: this.trpcService
        .protectedProcedure()
        .input(DatesDto)
        .query(async ({ ctx, input }) =>
          this.codingStatsService.getPeriodGeneralStats({
            userId: ctx.user.sub,
            start: input.start,
            end: input.end,
            groupBy: input.groupBy,
            periodResolution: input.periodResolution,
          }),
        ),
    }),
  };
}
