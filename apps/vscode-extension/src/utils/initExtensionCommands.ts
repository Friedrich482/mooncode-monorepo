import * as vscode from "vscode";
import { FileDataSync } from "../types-schemas";
import calculateTime from "./calculateTime";
import { getExtensionContext } from "../extension";
import getGlobalStateData from "./getGlobalStateData";
import login from "./auth/login";
import logout from "./auth/logout";
import openDashboard from "./openDashboard";
import register from "./auth/register";

const initExtensionCommands = (
  getTime: Awaited<ReturnType<typeof calculateTime>>,
  initialLanguagesData: Record<string, number>,
  initialFilesData: FileDataSync,
  statusBarItem: vscode.StatusBarItem,
) => {
  const context = getExtensionContext();

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

  const showGlobalStateContentCommand = vscode.commands.registerCommand(
    "MoonCode.showGlobalStateData",
    async () => {
      const data = await getGlobalStateData();
      console.log(data);
      vscode.window.showInformationMessage(
        `Global state data : ${JSON.stringify(data)}`,
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

  const openDashboardCommand = vscode.commands.registerCommand(
    "MoonCode.openDashboard",
    openDashboard,
  );

  context.subscriptions.push(
    showInitialLanguagesDataCommand,
    showCurrentLanguagesDataCommand,
    showInitialFilesDataCommand,
    showCurrentFilesDataCommand,
    showGlobalStateContentCommand,
    loginCommand,
    registerCommand,
    logoutCommand,
    openDashboardCommand,
    statusBarItem,
  );
};

export default initExtensionCommands;
