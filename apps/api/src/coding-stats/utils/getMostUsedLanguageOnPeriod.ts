import { NAString } from "src/common/dto";
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

  const mostUsedLanguageSlug: NAString =
    periodLanguagesTime.find(
      (language) => language.time === mostUsedLanguageTime,
    )?.languageSlug || "N/A";

  return mostUsedLanguageSlug;
};

export default getMostUsedLanguageOnPeriod;
