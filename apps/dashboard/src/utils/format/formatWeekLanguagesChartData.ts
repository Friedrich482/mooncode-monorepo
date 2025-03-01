import fetchWeekLanguagesData from "../fetch/fetchWeekLanguagesData";
import formatDuration from "@repo/utils/formatDuration";
import languagesColor from "@/colors.json";

const formatWeekLanguagesData = (
  data: Awaited<ReturnType<typeof fetchWeekLanguagesData>>,
) => {
  const { timeSpent } = data;
  return Object.entries(data.weekLanguagesTime)
    .map(([languageName, time]) => ({
      languageName,
      value: formatDuration(time),
      time: time,
      fill: languagesColor[languageName as keyof typeof languagesColor]
        ?.color as string,
      percentage: ((time * 100) / timeSpent).toFixed(2),
    }))
    .sort((a, b) => a.time - b.time);
};

export default formatWeekLanguagesData;
