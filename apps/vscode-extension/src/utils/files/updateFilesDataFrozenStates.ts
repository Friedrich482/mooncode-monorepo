import { MAX_IDLE_TIME, filesData } from "@/constants";
import getCurrentFileProperties from "./getCurrentFileProperties";
import vscode from "vscode";

const updateFilesDataFrozenStates = () => {
  const latestFile = getCurrentFileProperties(
    vscode.window.activeTextEditor?.document,
  );

  const now = performance.now();

  Object.keys(filesData).forEach((file) => {
    const fileData = filesData[file];

    if (!latestFile || file !== latestFile.absolutePath) {
      if (!fileData.isFrozen) {
        fileData.freezeStartTime = now;
        fileData.isFrozen = true;
        fileData.frozenTime = Math.floor((now - fileData.startTime) / 1000);
      }
      return;
    }

    const latestFileObj = filesData[latestFile.absolutePath];
    const idleDuration = Math.floor(
      (now - latestFileObj.lastActivityTime) / 1000,
    );

    if (idleDuration >= MAX_IDLE_TIME && !latestFileObj.isFrozen) {
      latestFileObj.frozenTime = Math.floor(
        (now - latestFileObj.startTime) / 1000,
      );
      latestFileObj.freezeStartTime = now;
      latestFileObj.isFrozen = true;
    } else if (
      idleDuration < MAX_IDLE_TIME &&
      latestFileObj.isFrozen &&
      latestFileObj.freezeStartTime
    ) {
      const freezeDuration = Math.floor(
        (now - latestFileObj.freezeStartTime) / 1000,
      );
      latestFileObj.startTime += Math.floor(freezeDuration * 1000);
      latestFileObj.frozenTime = null;
      latestFileObj.freezeStartTime = null;
      latestFileObj.isFrozen = false;
    }
  });
};

export default updateFilesDataFrozenStates;
