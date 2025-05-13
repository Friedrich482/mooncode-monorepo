import * as vscode from "vscode";
import { SYNC_DATA_KEY, languagesData } from "./constants";
import addStatusBarItem from "./utils/addStatusBarItem";
import getTime from "./utils/getTime";
import login from "./utils/auth/login";
import logout from "./utils/auth/logout";
import openDashBoard from "./utils/openDashBoard";
import periodicSyncData from "./utils/periodicSyncData";
import register from "./utils/auth/register";
import setStatusBarItem from "./utils/setStatusBarItem";
import trpc from "./utils/trpc/client";

let extensionContext: vscode.ExtensionContext;

export async function activate(context: vscode.ExtensionContext) {
  extensionContext = context;

  vscode.window.showInformationMessage(
    "MoonCode starts now tracking your coding time",
  );

  const statusBarItem = addStatusBarItem();
  const dateString = new Date().toLocaleDateString();

  const { timeSpent, dayLanguagesTime: initialLanguagesData } =
    await trpc.codingStats.getDailyStatsForExtension.query({
      dateString: dateString,
    });

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

  const timeGetter = getTime();
  let currentLanguagesData = timeGetter();

  // debugging commands
  const showCurrentDataCommand = vscode.commands.registerCommand(
    "MoonCode.showCurrentData",
    () => {
      currentLanguagesData = timeGetter();
      vscode.window.showInformationMessage(
        `currentLanguagesData: ${JSON.stringify(Object.entries(currentLanguagesData).map(([key, { elapsedTime }]) => `${key}: ${elapsedTime} seconds`))}`,
      );
    },
  );

  const showInitialDataCommand = vscode.commands.registerCommand(
    "MoonCode.showInitialData",
    () => {
      console.log(context.globalState.get(SYNC_DATA_KEY));
      vscode.window.showInformationMessage(
        `initialLanguagesData from server: ${JSON.stringify(Object.entries(initialLanguagesData).map(([key, elapsedTime]) => `${key}: ${elapsedTime} seconds`))}
        `,
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

  setInterval(async () => {
    await periodicSyncData(context, statusBarItem);
  }, 60000);

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
