import * as vscode from "vscode";
import addStatusBarItem from "./utils/addStatusBarItem";
import getTime from "./utils/getTime";
import { languagesData } from "./constants";
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

  const { timeSpent, dayLanguagesTime: initialLanguagesData } =
    await trpc.codingStats.getDailyStats.query({ offset: 0 });

  setStatusBarItem(timeSpent, statusBarItem);

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
  let body: unknown;

  const showDataCommand = vscode.commands.registerCommand(
    "MoonCode.showData",
    () => {
      currentLanguagesData = timeGetter();
      vscode.window.showInformationMessage(
        `currentLanguagesData: ${JSON.stringify(Object.entries(currentLanguagesData).map(([key, { elapsedTime }]) => `${key}: ${elapsedTime} seconds`))}
        initialLanguagesData: ${JSON.stringify(Object.entries(initialLanguagesData).map(([key, elapsedTime]) => `${key}: ${elapsedTime} seconds`))}`,
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
    body = await periodicSyncData(context, body, statusBarItem);
  }, 60000);

  context.subscriptions.push(
    showDataCommand,
    loginCommand,
    registerCommand,
    logoutCommand,
    openDashBoardCommand,
    statusBarItem,
  );
}

export async function deactivate() {
  console.log("MoonCode deactivated");
}

export const getExtensionContext = () => {
  if (!extensionContext) {
    throw new Error("Extension context has not been initialized.");
  }
  return extensionContext;
};
