import { DailyDataService } from "src/daily-data/daily-data.service";
import getWeekWithOffset from "./getWeekWithOffset";

const findDailyDataForWeek = async (
  userId: string,
  offset: number,
  dailyDataService: DailyDataService,
) => {
  const { start, end } = getWeekWithOffset(offset);

  const weekData = await dailyDataService.findRangeDailyData(
    userId,
    start,
    end,
  );
  return weekData;
};

export default findDailyDataForWeek;
