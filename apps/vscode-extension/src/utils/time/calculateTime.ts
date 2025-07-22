import * as vscode from "vscode";
import { MAX_IDLE_TIME, filesData } from "@/constants";
import { FileMap } from "@/types-schemas";
import getCurrentFileProperties from "../files/getCurrentFileProperties";
import { getExtensionContext } from "@/extension";
import getGlobalStateData from "../global-state/getGlobalStateData";
import isNewDayHandler from "./isNewDayHandler";
import updateCurrentFileObj from "../files/updateCurrentFileObj";

const calculateTime = async (): Promise<() => FileMap> => {
  const context = getExtensionContext();
  const disposables = context.subscriptions;

  let { dailyData, lastServerSync } = await getGlobalStateData();

  let timeoutId: NodeJS.Timeout | undefined;

  const runPeriodicCheck = async () => {
    try {
      const maybeUpdated = await isNewDayHandler(dailyData, lastServerSync);
      if (maybeUpdated) {
        dailyData = maybeUpdated.dailyData;
        lastServerSync = maybeUpdated.lastServerSync;
      }

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
    } catch (error) {
      console.error("Error in periodic check:", error);
    } finally {
      timeoutId = setTimeout(runPeriodicCheck, 1000);
    }
  };

  timeoutId = setTimeout(runPeriodicCheck, 1000);

  disposables.push({
    dispose: () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    },
  });

  const activityListeners = [
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        updateCurrentFileObj(editor.document);
      }
    }),

    vscode.workspace.onDidChangeTextDocument((event) => {
      if (
        vscode.window.activeTextEditor &&
        event.document === vscode.window.activeTextEditor.document
      ) {
        updateCurrentFileObj(event.document);
      }
    }),
  ];

  disposables.push(...activityListeners);

  const getTime = () => {
    const now = performance.now();

    // Update all files times
    Object.keys(filesData).forEach((file) => {
      const fileData = filesData[file];
      fileData.elapsedTime =
        fileData.isFrozen && fileData.frozenTime
          ? fileData.frozenTime
          : Math.floor((now - fileData.startTime) / 1000);
    });

    return filesData;
  };

  return getTime;
};

export default calculateTime;
