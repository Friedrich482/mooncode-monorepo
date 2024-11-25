import * as vscode from "vscode";
import getElapsedTime from "./utils/getElapsedTime";

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
  // This line of code will only be executed once when your extension is activated

  vscode.window.showInformationMessage(
    "MoonCode starts now tracking your code time"
  );
  getElapsedTime();

  // Now provide the implementation of the command with registerCommand
  // ! The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "MoonCode.start",
    () => {}
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export async function deactivate() {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log("MoonCode deactivated");
}
