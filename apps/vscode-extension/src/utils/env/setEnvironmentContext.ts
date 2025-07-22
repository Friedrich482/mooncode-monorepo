import { getExtensionContext } from "@/extension";
import vscode from "vscode";

const setEnvironmentContext = () => {
  const context = getExtensionContext();
  const isProd = context.extensionMode === vscode.ExtensionMode.Production;
  const isDev = context.extensionMode === vscode.ExtensionMode.Development;

  vscode.commands.executeCommand(
    "setContext",
    "MoonCode.isProdEnvironment",
    isProd,
  );
  vscode.commands.executeCommand(
    "setContext",
    "MoonCode.isDevEnvironment",
    isDev,
  );
};

export default setEnvironmentContext;
