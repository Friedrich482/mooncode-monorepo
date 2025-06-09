import * as vscode from "vscode";
import addStatusBarItem from "./utils/addStatusBarItem";
import calculateTime from "./utils/calculateTime";
import fetchInitialData from "./utils/fetchInitialData";
import getGlobalStateData from "./utils/getGlobalStateData";
import { languagesData } from "./constants";
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

  const { timeSpent, initialLanguagesData } = await fetchInitialData();

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

  const getTime = await calculateTime();
  let currentLanguagesData = getTime();

  setInterval(async () => {
    await periodicSyncData(context, statusBarItem, getTime);
  }, 60000);

  // debugging commands
  const showCurrentDataCommand = vscode.commands.registerCommand(
    "MoonCode.showCurrentData",
    () => {
      currentLanguagesData = getTime();
      vscode.window.showInformationMessage(
        `currentLanguagesData: ${JSON.stringify(Object.entries(currentLanguagesData).map(([key, { elapsedTime }]) => `${key}: ${elapsedTime} seconds`))}`,
      );
    },
  );

  const showInitialDataCommand = vscode.commands.registerCommand(
    "MoonCode.showInitialData",
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
    showCurrentDataCommand,
    showInitialDataCommand,
    loginCommand,
    registerCommand,
    logoutCommand,
    openDashBoardCommand,
    statusBarItem,
  );
}

export async function deactivate() {
  vscode.window.showInformationMessage("MoonCode deactivated");
}

export const getExtensionContext = () => {
  if (!extensionContext) {
    throw new Error("Extension context has not been initialized.");
  }
  return extensionContext;
};
