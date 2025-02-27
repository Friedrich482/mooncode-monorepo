import fetchTimeByDayOfWeek from "../fetch/fetchTimeByDayOfWeek";
import formatDuration from "../formatDuration";

const formatWeekChartData = (
  data: Awaited<ReturnType<typeof fetchTimeByDayOfWeek>> | undefined,
) => {
  if (!data) return [];

  return (
    Object.entries(data)
      .map(([date, values]) => ({
        originalDate: date,
        date: new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
        value: formatDuration(values.timeSpent),
        timeSpentBar: values.timeSpent,
      }))
      .sort(
        (a, b) =>
          new Date(a.originalDate).getTime() -
          new Date(b.originalDate).getTime(),
      )
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      .map(({ originalDate, ...rest }) => ({ ...rest }))
      .map((day) => ({ ...day, timeSpentLine: day.timeSpentBar }))
  );
};

export default formatWeekChartData;
