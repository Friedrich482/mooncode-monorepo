import fetchWeekLanguagesData from "./fetchWeekLanguagesData";

const formatWeekLanguagesData = (
  data: Awaited<ReturnType<typeof fetchWeekLanguagesData>>,
) => {
  return Object.entries(data.weekLanguagesTime).map(([languageName, time]) => {
    const seconds = time;
    const minutes = Math.floor((seconds % 3600) / 60);
    const hours = Math.floor(seconds / 3600);

    return {
      languageName,
      value: `${hours ? `${hours} hr${hours !== 1 ? "s" : ""} ` : ""}${minutes} min${minutes !== 1 ? "s" : ""}`,
      time: time,
    };
  });
};

export default formatWeekLanguagesData;
