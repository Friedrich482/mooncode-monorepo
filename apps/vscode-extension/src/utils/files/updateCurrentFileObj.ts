import * as vscode from "vscode";
import { filesData } from "../../constants";
import getCurrentFileProperties from "./getCurrentFileProperties";
import getLanguageId from "../languages/getLanguageId";

const updateCurrentFileObj = (document: vscode.TextDocument | undefined) => {
  const { relativePath, projectName } = getCurrentFileProperties(document);

  if (!relativePath || !projectName) {
    return;
  }
  const currentLanguageId = getLanguageId(document);

  if (!filesData[relativePath]) {
    filesData[relativePath] = {
      elapsedTime: 0,
      startTime: performance.now(),
      lastActivityTime: performance.now(),
      frozenTime: null,
      freezeStartTime: null,
      isFrozen: false,
      projectName,
      language: currentLanguageId,
    };
  }

  const currentFileData = filesData[relativePath];

  currentFileData.lastActivityTime = performance.now();
};

export default updateCurrentFileObj;
