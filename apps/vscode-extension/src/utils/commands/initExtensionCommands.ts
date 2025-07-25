import * as vscode from "vscode";
import { FileDataSync } from "@/types-schemas";
import calculateTime from "../time/calculateTime";
import { getExtensionContext } from "@/extension";
import getGlobalStateData from "../global-state/getGlobalStateData";
import login from "../auth/login";
import logout from "../auth/logout";
import openDashboard from "../dashboard/openDashboard";

const initExtensionCommands = (
  getTime: Awaited<ReturnType<typeof calculateTime>>,
  initialFilesData: FileDataSync,
  statusBarItem: vscode.StatusBarItem,
) => {
  const context = getExtensionContext();

  const showCurrentLanguagesDataCommand = vscode.commands.registerCommand(
    "MoonCode.showCurrentLanguagesData",
    () => {
      const filesData = getTime();

      const formattedData = Object.entries(
        Object.entries(filesData).reduce(
          (acc, [, { elapsedTime, languageSlug }]) => {
            acc[languageSlug] = (acc[languageSlug] || 0) + elapsedTime;
            return acc;
          },
          {} as Record<string, number>,
        ),
      )
        .map(([key, elapsedTime]) => `${key}: ${elapsedTime} seconds`)
        .join("\n");
      console.log(`Current Languages Data:\n${formattedData}`);
    },
  );

  const showInitialLanguagesDataCommand = vscode.commands.registerCommand(
    "MoonCode.showInitialLanguagesData",
    () => {
      const formattedData = Object.entries(
        Object.entries(initialFilesData).reduce(
          (acc, [, { timeSpent, languageSlug }]) => {
            acc[languageSlug] = (acc[languageSlug] || 0) + timeSpent;
            return acc;
          },
          {} as Record<string, number>,
        ),
      )
        .map(([key, elapsedTime]) => `${key}: ${elapsedTime} seconds`)
        .join("\n");
      console.log(`Initial Languages Data:\n${formattedData}`);
    },
  );

  const showCurrentFilesDataCommand = vscode.commands.registerCommand(
    "MoonCode.showCurrentFilesData",
    () => {
      const filesData = getTime();
      const formattedData = Object.entries(filesData)
        .map(([key, { elapsedTime }]) => `${key}: ${elapsedTime} seconds`)
        .join("\n");
      console.log(`Current files data:\n${formattedData}`);
    },
  );

  const showInitialFilesDataCommand = vscode.commands.registerCommand(
    "MoonCode.showInitialFilesData",
    () => {
      const formattedData = Object.entries(initialFilesData)
        .map(
          ([key, { timeSpent: elapsedTime }]) =>
            `${key}: ${elapsedTime} seconds`,
        )
        .join("\n");
      console.log(`InitialFilesData from server:\n${formattedData}`);
    },
  );

  const showGlobalStateContentCommand = vscode.commands.registerCommand(
    "MoonCode.showGlobalStateData",
    async () => {
      const data = await getGlobalStateData();
      console.dir(data, { depth: Infinity });
    },
  );

  const loginCommand = vscode.commands.registerCommand(
    "MoonCode.login",
    async () => {
      await login();
    },
  );

  const logoutCommand = vscode.commands.registerCommand(
    "MoonCode.logout",
    logout,
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
    logoutCommand,
    openDashboardCommand,
    statusBarItem,
  );
};

export default initExtensionCommands;
