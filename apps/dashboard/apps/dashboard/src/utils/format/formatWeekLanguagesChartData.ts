import fetchWeekLanguagesData from "../fetch/fetchWeekLanguagesData";
import formatDuration from "../formatDuration";
import languagesColor from "@/colors.json";

const formatWeekLanguagesData = (
  data: Awaited<ReturnType<typeof fetchWeekLanguagesData>>,
) => {
  return Object.entries(data.weekLanguagesTime)
    .map(([languageName, time]) => ({
      languageName,
      value: formatDuration(time),
      time: time,
      fill: languagesColor[
        languageName as keyof typeof languagesColor
      ] as string,
    }))
    .sort((a, b) => a.time - b.time);
};

export default formatWeekLanguagesData;
