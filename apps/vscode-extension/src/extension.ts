import * as vscode from "vscode";
import addStatusBarItem from "./utils/addStatusBarItem";
import fetchInitialLanguagesData from "./utils/fetchInitialLanguagesData";
import getTime from "./utils/getTime";
import { languagesData } from "./constants";
import login from "./utils/login";
import logout from "./utils/logout";
import openDashBoard from "./utils/openDashBoard";
import periodicSyncData from "./utils/periodicSyncData";
import register from "./utils/register";
import setStatusBarItem from "./utils/setStatusBarItem";

export async function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage(
    "MoonCode starts now tracking your coding time"
  );

  const statusBarItem = addStatusBarItem();

  const { timeSpent, dayLanguages: initialLanguagesData } =
    await fetchInitialLanguagesData(context);

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
        `${JSON.stringify(currentLanguagesData)}`
      );
      vscode.window.showInformationMessage(`${JSON.stringify(body)}`);
    }
  );
  const loginCommand = vscode.commands.registerCommand(
    "MoonCode.login",
    async () => {
      await login(context);
    }
  );
  const registerCommand = vscode.commands.registerCommand(
    "MoonCode.register",
    async () => {
      await register(context);
    }
  );
  const logoutCommand = vscode.commands.registerCommand(
    "MoonCode.logout",
    async () => {
      await logout(context);
    }
  );
  const openDashBoardCommand = vscode.commands.registerCommand(
    "MoonCode.openDashBoard",
    openDashBoard
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
    statusBarItem
  );
}

export async function deactivate() {
  console.log("MoonCode deactivated");
}
