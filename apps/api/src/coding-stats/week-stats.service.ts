import { CodingStatsDefault } from "./coding-stats.dto";
import { DailyDataService } from "src/daily-data/daily-data.service";
import { Injectable } from "@nestjs/common";
import { LanguagesService } from "src/languages/languages.service";
import findDailyDataForWeek from "src/utils/findDailyDataForWeek";
import formatDuration from "@repo/utils/formatDuration";

@Injectable()
export class WeekStatsService {
  constructor(
    private readonly dailyDataService: DailyDataService,
    private readonly languagesService: LanguagesService,
  ) {}

  async getDaysOfWeekStats({ userId, offset = 0 }: CodingStatsDefault) {
    const dailyDataForWeek = await findDailyDataForWeek(
      userId,
      offset,
      this.dailyDataService,
    );

    return dailyDataForWeek.map(({ timeSpent, date }) => ({
      timeSpentLine: timeSpent,
      originalDate: new Date(date).toDateString(),
      date: new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
      timeSpentBar: timeSpent,
      value: formatDuration(timeSpent),
    }));
  }
  async getWeekLanguagesTime({ userId, offset = 0 }: CodingStatsDefault) {
    const dailyDataForWeek = await findDailyDataForWeek(
      userId,
      offset,
      this.dailyDataService,
    );

    const totalTimeSpentInTheWeek = dailyDataForWeek
      .map((day) => day.timeSpent)
      .reduce((acc, curr) => acc + curr, 0);

    const kVLangTime = (
      await Promise.all(
        dailyDataForWeek.map(({ id }) =>
          this.languagesService.findAllLanguages(id),
        ),
      )
    ).reduce((acc, dayStats) => {
      Object.keys(dayStats).forEach((language) => {
        acc[language] = (acc[language] || 0) + dayStats[language];
      });
      return acc;
    }, {});

    const finalData = Object.entries(kVLangTime)
      .map(([languageName, timeSpent]) => ({
        languageName,
        time: timeSpent,
        value: formatDuration(timeSpent),
        percentage: parseFloat(
          ((timeSpent * 100) / totalTimeSpentInTheWeek).toFixed(2),
        ),
      }))
      .sort((a, b) => a.time - b.time);

    return finalData;
  }
  async getLanguagesWeekPerDay({ userId, offset = 0 }: CodingStatsDefault) {
    const dailyDataForWeek = await findDailyDataForWeek(
      userId,
      offset,
      this.dailyDataService,
    );
    return await Promise.all(
      dailyDataForWeek.map(async ({ id, date, timeSpent }) => ({
        originalDate: new Date(date).toDateString(),

        date: new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
        timeSpent,

        ...(await this.languagesService.findAllLanguages(id)),
      })),
    );
  }

  async getGeneralStatsPerWeek({ userId, offset = 0 }: CodingStatsDefault) {
    const avgTimePerDay = "something";
    // TODO fix this when the new dto will be fully standardized
    // formatDuration(
    //   (await this.getTimeSpentOnWeek({ userId, offset })).rawTime / 7,
    // );

    const dailyDataForWeek = await findDailyDataForWeek(
      userId,
      offset,
      this.dailyDataService,
    );
    const maxTimeSpentPerDay =
      dailyDataForWeek.length > 0
        ? Math.max(...dailyDataForWeek.map((day) => day.timeSpent))
        : 0;
    // TODO fix the fallback date
    const mostActiveDate =
      dailyDataForWeek.find((day) => day.timeSpent === maxTimeSpentPerDay)
        ?.date || "";

    const weekLanguagesTime = await this.getWeekLanguagesTime({
      userId,
      offset,
    });
    const mostUsedLanguageTime = weekLanguagesTime
      .map((language) => language.time)
      .reduce((max, curr) => (curr > max ? curr : max), 0);
    const mostUsedLanguage = weekLanguagesTime.find(
      (language) => language.time === mostUsedLanguageTime,
    )?.languageName;

    return {
      avgTimePerDay,
      mostActiveDate: new Date(mostActiveDate).toDateString(),
      mostUsedLanguage,
    };
  }
}
