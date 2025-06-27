import * as vscode from "vscode";
import { filesData } from "../../constants";
import getCurrentFileProperties from "./getCurrentFileProperties";
import getLanguageId from "../languages/getLanguageId";

const updateCurrentFileObj = (document: vscode.TextDocument | undefined) => {
  const { absolutePath, projectName, projectPath } =
    getCurrentFileProperties(document);
  const currentLanguageId = getLanguageId(document);

  if (!absolutePath || !projectName || !projectPath || !currentLanguageId) {
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
      languageSlug: currentLanguageId,
    };
  }

  const currentFileData = filesData[absolutePath];

  currentFileData.lastActivityTime = performance.now();
  currentFileData.languageSlug = currentLanguageId;
  currentFileData.projectName = projectName;
  currentFileData.projectPath = projectPath;
};

export default updateCurrentFileObj;
