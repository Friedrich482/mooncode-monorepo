import getLanguageId from "./getLanguageId";
import { languagesData } from "../constants";

const updateCurrentLanguage = (currentLanguageId: string) => {
  currentLanguageId = getLanguageId(currentLanguageId) || "other";

  if (!languagesData[currentLanguageId]) {
    languagesData[currentLanguageId] = {
      elapsedTime: 0,
      startTime: performance.now(),
      lastActivityTime: performance.now(),
      frozenTime: null,
      freezeStartTime: null,
      isFrozen: false,
    };
  }

  const currentLanguageData = languagesData[currentLanguageId];

  currentLanguageData.lastActivityTime = performance.now();
};

export default updateCurrentLanguage;
