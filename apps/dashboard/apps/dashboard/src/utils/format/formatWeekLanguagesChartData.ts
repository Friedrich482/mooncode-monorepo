import fetchWeekLanguagesData from "../fetch/fetchWeekLanguagesData";
import formatDuration from "../formatDuration";

const formatWeekLanguagesData = (
  data: Awaited<ReturnType<typeof fetchWeekLanguagesData>>,
) => {
  return Object.entries(data.weekLanguagesTime).map(([languageName, time]) => {
    return {
      languageName,
      value: formatDuration(time),
      time: time,
    };
  });
};

export default formatWeekLanguagesData;
