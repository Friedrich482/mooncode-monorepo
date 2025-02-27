import fetchWeekLanguagesData from "../fetch/fetchWeekLanguagesData";

const formatWeekLangByDayChart = (
  data: Awaited<ReturnType<typeof fetchWeekLanguagesData>>,
) => {
  return Object.entries(data.daysOfWeekStats)
    .map(([date, { timeSpent, languages }]) => ({
      originalDate: date,

      date: new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
      timeSpent,
      ...Object.fromEntries(
        Object.entries(languages).sort(([, a], [, b]) => a - b),
      ),
    }))
    .sort(
      (a, b) =>
        new Date(a.originalDate).getTime() - new Date(b.originalDate).getTime(),
    );
};
export default formatWeekLangByDayChart;
