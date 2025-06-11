import * as vscode from "vscode";
import { filesData, languagesData } from "./constants";
import addStatusBarItem from "./utils/addStatusBarItem";
import calculateTime from "./utils/calculateTime";
import fetchInitialData from "./utils/fetchInitialData";
import getGlobalStateData from "./utils/getGlobalStateData";
import login from "./utils/auth/login";
import logout from "./utils/auth/logout";
import openDashBoard from "./utils/openDashBoard";
import periodicSyncData from "./utils/periodicSyncData";
import register from "./utils/auth/register";
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
      language: file.language,
    };
  });

  const getTime = await calculateTime();

  setInterval(async () => {
    await periodicSyncData(context, statusBarItem, getTime);
  }, 60000);

  // debugging commands
  const showCurrentLanguagesDataCommand = vscode.commands.registerCommand(
    "MoonCode.showCurrentLanguagesData",
    () => {
      const { languagesData } = getTime();
      vscode.window.showInformationMessage(
        `currentLanguagesData: ${JSON.stringify(Object.entries(languagesData).map(([key, { elapsedTime }]) => `${key}: ${elapsedTime} seconds`))}`,
      );
    },
  );

  const showInitialLanguagesDataCommand = vscode.commands.registerCommand(
    "MoonCode.showInitialLanguagesData",
    async () => {
      const globalStateData = await getGlobalStateData();

      vscode.window.showInformationMessage(
        `initialLanguagesData from server: ${JSON.stringify(Object.entries(initialLanguagesData).map(([key, elapsedTime]) => `${key}: ${elapsedTime} seconds`))}`,
      );

      vscode.window.showInformationMessage(
        `Global state content: ${JSON.stringify(globalStateData)}`,
      );
    },
  );

  const showCurrentFilesDataCommand = vscode.commands.registerCommand(
    "MoonCode.showCurrentFilesData",
    () => {
      const { filesData: currentFilesData } = getTime();
      vscode.window.showInformationMessage(
        `currentFilesData: ${JSON.stringify(Object.entries(currentFilesData).map(([key, { elapsedTime }]) => `${key}: ${elapsedTime} seconds`))}`,
      );
    },
  );

  const showInitialFilesDataCommand = vscode.commands.registerCommand(
    "MoonCode.showInitialFilesData",
    async () => {
      vscode.window.showInformationMessage(
        `initialFilesData from server: ${JSON.stringify(Object.entries(initialFilesData).map(([key, { timeSpent: elapsedTime }]) => `${key}: ${elapsedTime} seconds`))}`,
      );
    },
  );

  const loginCommand = vscode.commands.registerCommand(
    "MoonCode.login",
    async () => {
      await login();
    },
  );

  const registerCommand = vscode.commands.registerCommand(
    "MoonCode.register",
    async () => {
      await register();
    },
  );

  const logoutCommand = vscode.commands.registerCommand(
    "MoonCode.logout",
    async () => {
      await logout();
    },
  );

  const openDashBoardCommand = vscode.commands.registerCommand(
    "MoonCode.openDashBoard",
    openDashBoard,
  );

  context.subscriptions.push(
    showInitialLanguagesDataCommand,
    showCurrentLanguagesDataCommand,
    showInitialFilesDataCommand,
    showCurrentFilesDataCommand,
    loginCommand,
    registerCommand,
    logoutCommand,
    openDashBoardCommand,
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
