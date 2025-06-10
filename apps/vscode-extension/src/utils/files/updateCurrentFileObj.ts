import * as vscode from "vscode";
import { filesData } from "../../constants";
import getCurrentFileProperties from "./getCurrentFileProperties";
import getLanguageId from "../languages/getLanguageId";

const updateCurrentFileObj = (document: vscode.TextDocument | undefined) => {
  const { relativePath, projectName, projectPath } =
    getCurrentFileProperties(document);
  const currentLanguageId = getLanguageId(document);

  if (!relativePath || !projectName || !projectPath || !currentLanguageId) {
    return;
  }

  if (!filesData[relativePath]) {
    filesData[relativePath] = {
      elapsedTime: 0,
      startTime: performance.now(),
      lastActivityTime: performance.now(),
      frozenTime: null,
      freezeStartTime: null,
      isFrozen: false,
      projectName,
      projectPath,
      language: currentLanguageId,
    };
  }

  const currentFileData = filesData[relativePath];

  currentFileData.lastActivityTime = performance.now();
};

export default updateCurrentFileObj;
