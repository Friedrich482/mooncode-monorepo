import * as vscode from "vscode";
import getTime from "./utils/getTime";

export function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage(
    "MoonCode starts now tracking your code time"
  );

  const timeGetter = getTime();

  const disposable = vscode.commands.registerCommand("MoonCode.start", () => {
    const languagesData = timeGetter();
    vscode.window.showInformationMessage(`${JSON.stringify(languagesData)}`);
    Object.keys(languagesData).forEach((key) => {
      vscode.window.showInformationMessage(
        `Index ${Object.keys(languagesData).indexOf(key)}; Time : ${
          languagesData[key].elapsedTime
        }, Language: ${languagesData[key].language}`
      );
    });
  });

  context.subscriptions.push(disposable);

  vscode.commands.executeCommand("MoonCode.start");
}

export async function deactivate() {
  console.log("MoonCode deactivated");
}
