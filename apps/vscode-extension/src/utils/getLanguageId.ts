import { forbiddenLanguages, languageMapping } from "../constants";

const getLanguageId = (languageId: string | undefined) => {
  if (!languageId || forbiddenLanguages.includes(languageId)) {
    return;
  }

  // if the languageId given by vscode is a subset of a language
  // for example dockerfile (subset of docker)
  // just assign it to the language itself instead of using that subset
  if (languageMapping[languageId]) {
    languageId = languageMapping[languageId];
  }

  return languageId;
};

export default getLanguageId;
