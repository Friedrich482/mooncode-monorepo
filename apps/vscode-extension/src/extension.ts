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

export async function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage(
    "MoonCode starts now tracking your coding time"
  );

  const initialLanguagesData = await fetchInitialLanguagesData(context);
  initialLanguagesData.forEach(({ timeSpent, languageName }) => {
    const now = performance.now();
    const elapsedTimeInSeconds = timeSpent * 60;

    languagesData[languageName] = {
      elapsedTime: elapsedTimeInSeconds,
      freezeStartTime: null,
      frozenTime: null,
      isFrozen: false,
      lastActivityTime: now,
      startTime: now - elapsedTimeInSeconds * 1000,
    };
  });

  const timeGetter = getTime();
  let currentLanguagesData = timeGetter();
  let body: unknown;

  const disposable = vscode.commands.registerCommand(
    "MoonCode.showData",
    () => {
      currentLanguagesData = timeGetter();
      vscode.window.showInformationMessage(
        `${JSON.stringify(currentLanguagesData)}`
      );
      vscode.window.showInformationMessage(`${JSON.stringify(body)}`);
    }
  );
  const disposable2 = vscode.commands.registerCommand(
    "MoonCode.login",
    async () => {
      await login(context);
    }
  );
  const disposable3 = vscode.commands.registerCommand(
    "MoonCode.register",
    async () => {
      await register(context);
    }
  );
  const disposable4 = vscode.commands.registerCommand(
    "MoonCode.logout",
    async () => {
      await logout(context);
    }
  );
  const disposable5 = vscode.commands.registerCommand(
    "MoonCode.openDashBoard",
    openDashBoard
  );

  const statusBarItem = addStatusBarItem();

  setInterval(async () => {
    body = await periodicSyncData(context, body, statusBarItem);
  }, 60000);

  context.subscriptions.push(
    disposable,
    disposable2,
    disposable3,
    disposable4,
    disposable5,
    statusBarItem
  );
}

export async function deactivate() {
  console.log("MoonCode deactivated");
}
