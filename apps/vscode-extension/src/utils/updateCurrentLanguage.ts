import getLanguageId from "./getLanguageId";
import { updateLanguageData } from "./getTime";

const updateCurrentLanguage = (currentLanguageId: string) => {
  currentLanguageId = getLanguageId(currentLanguageId) || "other";

  const currentLanguageData = updateLanguageData(currentLanguageId);
  currentLanguageData.lastActivityTime = performance.now();
};

export default updateCurrentLanguage;
