import * as vscode from "vscode";
import getTime from "./utils/getTime";

export function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage(
    "MoonCode starts now tracking your code time"
  );

  const timeGetter = getTime();
  let languagesData = timeGetter();

  const disposable = vscode.commands.registerCommand(
    "MoonCode.showData",
    () => {
      languagesData = timeGetter();
      vscode.window.showInformationMessage(`${JSON.stringify(languagesData)}`);
    }
  );

  context.subscriptions.push(disposable);
}

export async function deactivate() {
  console.log("MoonCode deactivated");
}
