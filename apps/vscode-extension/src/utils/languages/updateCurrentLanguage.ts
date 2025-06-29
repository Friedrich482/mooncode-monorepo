import * as vscode from "vscode";
import getLanguageSlug from "./getLanguageSlug";
import { languagesData } from "../../constants";

const updateCurrentLanguage = (document: vscode.TextDocument | undefined) => {
  const currentLanguageSlug = getLanguageSlug(document);

  if (!currentLanguageSlug) {
    return;
  }

  if (!languagesData[currentLanguageSlug]) {
    languagesData[currentLanguageSlug] = {
      elapsedTime: 0,
      startTime: performance.now(),
      lastActivityTime: performance.now(),
      frozenTime: null,
      freezeStartTime: null,
      isFrozen: false,
    };
  }

  const currentLanguageData = languagesData[currentLanguageSlug];

  currentLanguageData.lastActivityTime = performance.now();
};

export default updateCurrentLanguage;
