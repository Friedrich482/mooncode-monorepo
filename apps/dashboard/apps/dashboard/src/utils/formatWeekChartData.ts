import fetchTimeByDayOfWeek from "./fetchTimeByDayOfWeek";

const formatWeekChartData = (
  data: Awaited<ReturnType<typeof fetchTimeByDayOfWeek>> | undefined,
) => {
  if (!data) return [];

  return Object.entries(data)
    .map(([date, values]) => {
      const seconds = values.timeSpent;
      const minutes = Math.floor((seconds % 3600) / 60);
      const hours = Math.floor(seconds / 3600);

      return {
        originalDate: date,
        date: new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
        value: `${hours ? `${hours} hr${hours !== 1 ? "s" : ""} ` : ""}${minutes} min${minutes !== 1 ? "s" : ""}`,
        timeSpent: values.timeSpent,
      };
    })
    .sort(
      (a, b) =>
        new Date(a.originalDate).getTime() - new Date(b.originalDate).getTime(),
    )
    .map((elt) => ({ ...elt, timeSpentLine: elt.timeSpent }));
};

export default formatWeekChartData;
