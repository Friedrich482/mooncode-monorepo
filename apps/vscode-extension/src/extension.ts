import * as vscode from "vscode";
import getTime from "./utils/getTime";

export function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage(
    "MoonCode starts now tracking your code time"
  );

  // Initialize timer
  const currentElapsedTime = getTime();

  // Register command
  const disposable = vscode.commands.registerCommand("MoonCode.start", () => {
    const time = currentElapsedTime();
    vscode.window.showInformationMessage(`Your time is ${time} seconds`);
  });

  context.subscriptions.push(disposable);

  // Optional: Trigger the command immediately for demonstration
  vscode.commands.executeCommand("MoonCode.start");
}

export async function deactivate() {
  console.log("MoonCode deactivated");
}
