import * as vscode from "vscode";
import { filesData, languagesData } from "./constants";
import addStatusBarItem from "./utils/addStatusBarItem";
import calculateTime from "./utils/calculateTime";
import fetchInitialData from "./utils/fetchInitialData";
import initExtensionCommands from "./utils/initExtensionCommands";
import periodicSyncData from "./utils/periodicSyncData";
import serveDashboard from "./utils/serveDashboard";
import setStatusBarItem from "./utils/setStatusBarItem";

let extensionContext: vscode.ExtensionContext;

export async function activate(context: vscode.ExtensionContext) {
  extensionContext = context;

  vscode.window.showInformationMessage(
    "MoonCode starts now tracking your coding time",
  );

  const statusBarItem = addStatusBarItem();

  const { timeSpent, initialLanguagesData, initialFilesData } =
    await fetchInitialData();

  setStatusBarItem(timeSpent, statusBarItem);

  // initialize the time for each language found
  Object.keys(initialLanguagesData).forEach((languageName) => {
    const timeSpent = initialLanguagesData[languageName];
    const now = performance.now();

    languagesData[languageName] = {
      elapsedTime: timeSpent,
      freezeStartTime: null,
      frozenTime: null,
      isFrozen: false,
      lastActivityTime: now,
      startTime: now - timeSpent * 1000,
    };
  });

  // initialize the time/other metadata for each file found
  Object.keys(initialFilesData).forEach((filePath) => {
    const file = initialFilesData[filePath];
    const now = performance.now();

    filesData[filePath] = {
      elapsedTime: file.timeSpent,
      frozenTime: null,
      freezeStartTime: null,
      isFrozen: false,
      lastActivityTime: now,
      startTime: now - file.timeSpent * 1000,
      projectName: file.projectName,
      projectPath: file.projectPath,
      languageSlug: file.languageSlug,
    };
  });

  const getTime = await calculateTime();

  setInterval(async () => {
    await periodicSyncData(context, statusBarItem, getTime);
  }, 60000);

  serveDashboard(context);

  initExtensionCommands(
    getTime,
    initialLanguagesData,
    initialFilesData,
    statusBarItem,
  );
}

export async function deactivate() {
  const disposables: vscode.Disposable[] = [];

  const getTime = await calculateTime();
  disposables.push({
    dispose: () =>
      ((getTime as any).dispose = () => {
        disposables.forEach((d) => d.dispose());
      }),
  });

  vscode.window.showInformationMessage("MoonCode deactivated");
}

export const getExtensionContext = () => {
  if (!extensionContext) {
    throw new Error("Extension context has not been initialized.");
  }
  return extensionContext;
};
