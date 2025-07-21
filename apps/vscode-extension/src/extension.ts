import addStatusBarItem from "./utils/addStatusBarItem";
import calculateTime from "./utils/calculateTime";
import fetchInitialData from "./utils/fetchInitialData";
import initExtensionCommands from "./utils/initExtensionCommands";
import initializeFiles from "./utils/files/initializeFiles";
import periodicSyncData from "./utils/periodicSyncData";
import registerAuthUriHandler from "./utils/auth/registerAuthUriHandler";
import serveDashboard from "./utils/serveDashboard";
import setEnvironmentContext from "./utils/setEnvironmentContext";
import setStatusBarItem from "./utils/setStatusBarItem";
import vscode from "vscode";

let extensionContext: vscode.ExtensionContext;
let dashboardPort: number | undefined;

export async function activate(context: vscode.ExtensionContext) {
  extensionContext = context;

  setEnvironmentContext();
  dashboardPort = await serveDashboard(context);
  registerAuthUriHandler();

  vscode.window.showInformationMessage(
    "MoonCode starts now tracking your coding time",
  );

  const statusBarItem = addStatusBarItem();

  const { timeSpent, initialFilesData } = await fetchInitialData();

  setStatusBarItem(timeSpent, statusBarItem);

  initializeFiles(initialFilesData);

  const getTime = await calculateTime();

  setInterval(async () => {
    await periodicSyncData(context, statusBarItem, getTime);
  }, 60000);

  initExtensionCommands(getTime, initialFilesData, statusBarItem);
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

export const getDashboardPort = () => {
  if (!dashboardPort) {
    throw new Error(
      "Failed to start the extension. Dashboard could not be served.",
    );
  }
  return dashboardPort;
};
