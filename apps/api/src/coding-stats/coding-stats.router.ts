import { CodingStatsDto, DatesDto, TimeOffsetDto } from "./coding-stats.dto";
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
        .input(CodingStatsDto)
        .mutation(async ({ ctx, input }) =>
          this.codingStatsService.upsert({
            id: ctx.user.sub,
            updateCodingStatsDto: input,
          }),
        ),

      getDailyStats: this.trpcService
        .protectedProcedure()
        .input(TimeOffsetDto)
        .query(async ({ ctx, input }) =>
          this.codingStatsService.getDailyStats({
            offset: input.offset,
            userId: ctx.user.sub,
          }),
        ),

      getDailyStatsForChart: this.trpcService
        .protectedProcedure()
        .input(TimeOffsetDto)
        .query(async ({ ctx, input }) =>
          this.codingStatsService.getDailyStatsForChart({
            offset: input.offset,
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

      getDaysOfWeekStats: this.trpcService
        .protectedProcedure()
        .input(TimeOffsetDto)
        .query(async ({ ctx, input }) =>
          this.codingStatsService.getDaysOfWeekStats({
            userId: ctx.user.sub,
            offset: input.offset,
          }),
        ),

      getWeekLanguagesTime: this.trpcService
        .protectedProcedure()
        .input(TimeOffsetDto)
        .query(async ({ ctx, input }) =>
          this.codingStatsService.getWeekLanguagesTime({
            userId: ctx.user.sub,
            offset: input.offset,
          }),
        ),

      getLanguagesWeekPerDay: this.trpcService
        .protectedProcedure()
        .input(TimeOffsetDto)
        .query(async ({ ctx, input }) =>
          this.codingStatsService.getLanguagesWeekPerDay({
            userId: ctx.user.sub,
            offset: input.offset,
          }),
        ),

      getGeneralStatsPerWeek: this.trpcService
        .protectedProcedure()
        .input(TimeOffsetDto)
        .query(async ({ ctx, input }) =>
          this.codingStatsService.getGeneralStatsPerWeek({
            userId: ctx.user.sub,
            offset: input.offset,
          }),
        ),
    }),
  };
}
