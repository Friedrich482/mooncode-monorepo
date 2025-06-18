import {
  DayFilesStatsDto,
  GetProjectFilesOnPeriodDto,
  GetProjectLanguagesPerDayOfPeriodDto,
  GetProjectLanguagesTimeOnPeriodDto,
  GetProjectOnPeriodDto,
  GetProjectPerDayOfPeriodDto,
  UpsertFilesDto,
} from "./files-stats.dto";
import { DatesDto } from "src/common/dto";
import { FilesStatsService } from "./files-stats.service";
import { Injectable } from "@nestjs/common";
import { TrpcService } from "src/trpc/trpc.service";

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

      getDailyFilesStatsForExtension: this.trpcService
        .protectedProcedure()
        .input(DayFilesStatsDto)
        .query(async ({ ctx, input }) =>
          this.filesStatsService.getDailyFilesStatsForExtension({
            userId: ctx.user.sub,
            dayFilesStatsDto: input,
          }),
        ),

      getPeriodProjects: this.trpcService
        .protectedProcedure()
        .input(DatesDto)
        .query(async ({ ctx, input }) =>
          this.filesStatsService.getPeriodProjects({
            userId: ctx.user.sub,
            start: input.start,
            end: input.end,
            periodResolution: input.periodResolution,
          }),
        ),

      getProjectOnPeriod: this.trpcService
        .protectedProcedure()
        .input(GetProjectOnPeriodDto)
        .query(async ({ ctx, input }) =>
          this.filesStatsService.getProjectOnPeriod({
            start: input.start,
            end: input.end,
            name: input.name,
            periodResolution: input.periodResolution,
            userId: ctx.user.sub,
          }),
        ),

      getProjectPerDayOfPeriod: this.trpcService
        .protectedProcedure()
        .input(GetProjectPerDayOfPeriodDto)
        .query(async ({ ctx, input }) =>
          this.filesStatsService.getProjectPerDayOfPeriod({
            userId: ctx.user.sub,
            name: input.name,
            start: input.start,
            end: input.end,
            groupBy: input.groupBy,
            periodResolution: input.periodResolution,
          }),
        ),

      getProjectLanguagesTimeOnPeriod: this.trpcService
        .protectedProcedure()
        .input(GetProjectLanguagesTimeOnPeriodDto)
        .query(async ({ ctx, input }) =>
          this.filesStatsService.getProjectLanguagesTimeOnPeriod({
            userId: ctx.user.sub,
            start: input.start,
            end: input.end,
            name: input.name,
            periodResolution: input.periodResolution,
          }),
        ),

      getProjectLanguagesPerDayOfPeriod: this.trpcService
        .protectedProcedure()
        .input(GetProjectLanguagesPerDayOfPeriodDto)
        .query(async ({ ctx, input }) =>
          this.filesStatsService.getProjectLanguagesPerDayOfPeriod({
            userId: ctx.user.sub,
            start: input.start,
            end: input.end,
            name: input.name,
            periodResolution: input.periodResolution,
            groupBy: input.groupBy,
          }),
        ),

      getProjectFilesOnPeriod: this.trpcService
        .protectedProcedure()
        .input(GetProjectFilesOnPeriodDto)
        .query(async ({ ctx, input }) =>
          this.filesStatsService.getProjectFilesOnPeriod({
            userId: ctx.user.sub,
            start: input.start,
            end: input.end,
            name: input.name,
            periodResolution: input.periodResolution,
          }),
        ),
    }),
  };
}
