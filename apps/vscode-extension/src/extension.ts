import * as vscode from "vscode";
import getTime from "./utils/getTime";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("MoonCode.start", () => {
    vscode.window.showInformationMessage(
      "MoonCode starts now tracking your code time"
    );
    getTime();
  });

  context.subscriptions.push(disposable);

  vscode.commands.executeCommand("MoonCode.start");
}

export async function deactivate() {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log("MoonCode deactivated");
}
