import * as vscode from "vscode";
import { FileMap } from "@/types-schemas";
import { getExtensionContext } from "@/extension";
import getGlobalStateData from "../global-state/getGlobalStateData";
import isNewDayHandler from "./isNewDayHandler";
import updateCurrentFileObj from "../files/updateCurrentFileObj";
import updateFilesDataElapsedTime from "../files/updateFilesDataElapsedTime";
import updateFilesDataFrozenStates from "../files/updateFilesDataFrozenStates";

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

      updateFilesDataFrozenStates();
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
    return updateFilesDataElapsedTime();
  };

  return getTime;
};

export default calculateTime;
