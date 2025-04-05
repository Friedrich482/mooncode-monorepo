import { DailyDataService } from "src/daily-data/daily-data.service";
import { Injectable } from "@nestjs/common";
import formatDuration from "@repo/utils/formatDuration";

@Injectable()
export class CommonMethodsService {
  constructor(private readonly dailyDataService: DailyDataService) {}
  async getTimeSpentOnPeriod({
    userId,
    start,
    end,
  }: {
    userId: string;
    start: string;
    end: string;
  }) {
    const dailyDataForPeriod = await this.dailyDataService.findRangeDailyData(
      userId,
      start,
      end,
    );

    const timeSpent = dailyDataForPeriod
      .map((day) => day.timeSpent)
      .reduce((acc, curr) => acc + curr, 0);

    return { rawTime: timeSpent, formattedTime: formatDuration(timeSpent) };
  }
}
