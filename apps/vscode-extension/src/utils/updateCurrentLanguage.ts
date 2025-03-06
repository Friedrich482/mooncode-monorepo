import { forbiddenLanguages, subsetLanguages } from "../constants";
import { updateLanguageData } from "./getTime";

const updateCurrentLanguage = (currentLanguageId: string) => {
  if (forbiddenLanguages.includes(currentLanguageId)) {
    return;
  }

  // if the languageId given by vscode is a subset of a language for example dockerfile (subset of docker)
  //   just assign it to the language itself instead of using that subset
  if (subsetLanguages[currentLanguageId]) {
    currentLanguageId = subsetLanguages[currentLanguageId];
  }

  const currentLanguageData = updateLanguageData(currentLanguageId);
  currentLanguageData.lastActivityTime = performance.now();
};

export default updateCurrentLanguage;
