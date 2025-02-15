import fetchTimeByDayOfWeek from "./fetchTimeByDayOfWeek";

const formatWeekChartData = (
  data: Awaited<ReturnType<typeof fetchTimeByDayOfWeek>> | undefined,
) => {
  if (!data) return [];

  return Object.entries(data)
    .map(([date, values]) => ({
      originalDate: date,
      date: new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
      timeSpent: values.timeSpent,
      label: "time spent",
    }))
    .sort(
      (a, b) =>
        new Date(a.originalDate).getTime() - new Date(b.originalDate).getTime(),
    );
};

export default formatWeekChartData;
