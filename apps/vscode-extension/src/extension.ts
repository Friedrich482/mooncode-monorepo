import * as vscode from "vscode";
import getTime from "./utils/getTime";

export function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage(
    "MoonCode starts now tracking your code time"
  );

  const currentElapsedTime = getTime();

  const disposable_1 = vscode.commands.registerCommand("MoonCode.start", () => {
    const timeArray = currentElapsedTime();
    timeArray.forEach((data) =>
      vscode.window.showInformationMessage(
        `Index ${timeArray.indexOf(data)} Time : ${data.time}, Language: ${
          data.language
        }`
      )
    );
  });

  context.subscriptions.push(disposable_1);

  // Optional: Trigger the command immediately for demonstration
  vscode.commands.executeCommand("MoonCode.start");
}

export async function deactivate() {
  console.log("MoonCode deactivated");
}
