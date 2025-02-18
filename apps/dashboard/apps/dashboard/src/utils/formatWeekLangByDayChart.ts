const formatWeekLangByDayChart = (
  data: Record<
    string,
    {
      timeSpent: number;
      languages: Record<string, number>;
    }
  >,
) => {
  return Object.entries(data)
    .map(([date, { timeSpent, languages }]) => ({
      originalDate: date,

      date: new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
      timeSpent,
      ...languages,
    }))
    .sort(
      (a, b) =>
        new Date(a.originalDate).getTime() - new Date(b.originalDate).getTime(),
    );
};
export default formatWeekLangByDayChart;
