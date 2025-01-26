import * as vscode from "vscode";
import getTime from "./utils/getTime";
import getToken from "./utils/getToken";
import login from "./utils/login";
import logout from "./utils/logout";
import register from "./utils/register";

export function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage(
    "MoonCode starts now tracking your coding time"
  );

  const timeGetter = getTime();
  let languagesData = timeGetter();
  let body: unknown;

  const disposable = vscode.commands.registerCommand(
    "MoonCode.showData",
    () => {
      languagesData = timeGetter();
      vscode.window.showInformationMessage(`${JSON.stringify(languagesData)}`);
      vscode.window.showInformationMessage(`${JSON.stringify(body)}`);
    }
  );
  const disposable2 = vscode.commands.registerCommand(
    "MoonCode.login",
    async () => {
      await login(context);
    }
  );
  // ! this command(register) is only for tests purpose, remove it after development
  const disposable3 = vscode.commands.registerCommand(
    "MoonCode.register",
    async () => {
      await register(context);
    }
  );

  const disposable4 = vscode.commands.registerCommand(
    "MoonCode.logout",
    async () => {
      await logout(context);
    }
  );

  setInterval(async () => {
    const timeSpentPerLanguage = Object.fromEntries(
      Object.entries(timeGetter()).map(([key, { elapsedTime }]) => [
        key,
        elapsedTime,
      ])
    );
    const timeSpentToday = Object.values(timeSpentPerLanguage).reduce(
      (acc, value) => acc + value,
      0
    );
    const authToken = await getToken(context);

    const res = await fetch("http://localhost:3000/api/coding-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        timeSpentToday,
        timeSpentPerLanguage: Object.fromEntries(
          Object.entries(timeGetter()).map(([key, { elapsedTime }]) => [
            key,
            elapsedTime,
          ])
        ),
      }),
    });

    body = await res.json();
  }, 60000);

  context.subscriptions.push(disposable, disposable2, disposable3, disposable4);
}

export async function deactivate() {
  console.log("MoonCode deactivated");
}
