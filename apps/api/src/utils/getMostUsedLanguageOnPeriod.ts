import { PeriodStatsService } from "src/coding-stats/period-stats.service";

const getMostUsedLanguageOnPeriod = async (
  periodStatsService: PeriodStatsService,
  userId: string,
  start: string,
  end: string,
) => {
  const periodLanguagesTime = await periodStatsService.getPeriodLanguagesTime({
    userId,
    start,
    end,
  });
  const mostUsedLanguageTime = periodLanguagesTime
    .map((language) => language.time)
    .reduce((max, curr) => (curr > max ? curr : max), 0);
  const mostUsedLanguage =
    periodLanguagesTime.find(
      (language) => language.time === mostUsedLanguageTime,
    )?.languageName || "unknown";
  return mostUsedLanguage;
};

export default getMostUsedLanguageOnPeriod;
