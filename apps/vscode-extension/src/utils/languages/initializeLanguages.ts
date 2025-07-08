import { languagesData } from "../../constants";

const initializeLanguages = (data: Record<string, number>) => {
  // initialize the time for each language found
  Object.keys(data).forEach((languageName) => {
    const timeSpent = data[languageName];
    const now = performance.now();

    languagesData[languageName] = {
      elapsedTime: timeSpent,
      freezeStartTime: null,
      frozenTime: null,
      isFrozen: false,
      lastActivityTime: now,
      startTime: now - timeSpent * 1000,
    };
  });
};

export default initializeLanguages;
