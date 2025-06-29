import * as vscode from "vscode";
import { filesData } from "../../constants";
import getCurrentFileProperties from "./getCurrentFileProperties";
import getLanguageSlug from "../languages/getLanguageSlug";

const updateCurrentFileObj = (document: vscode.TextDocument | undefined) => {
  const { absolutePath, projectName, projectPath } =
    getCurrentFileProperties(document);
  const currentLanguageSlug = getLanguageSlug(document);

  if (!absolutePath || !projectName || !projectPath || !currentLanguageSlug) {
    return;
  }

  if (!filesData[absolutePath]) {
    filesData[absolutePath] = {
      elapsedTime: 0,
      startTime: performance.now(),
      lastActivityTime: performance.now(),
      frozenTime: null,
      freezeStartTime: null,
      isFrozen: false,
      projectName,
      projectPath,
      languageSlug: currentLanguageSlug,
    };
  }

  const currentFileData = filesData[absolutePath];

  currentFileData.lastActivityTime = performance.now();
  currentFileData.languageSlug = currentLanguageSlug;
  currentFileData.projectName = projectName;
  currentFileData.projectPath = projectPath;
};

export default updateCurrentFileObj;
