import * as vscode from "vscode";
import fetchToken from "./fetchToken";
import register from "./register";
import storeToken from "./storeToken";

const login = async (context: vscode.ExtensionContext) => {
  const username = await vscode.window.showInputBox({
    prompt: "Enter your username",
    title: "Username",
  });
  const password = await vscode.window.showInputBox({
    prompt: "Enter your password",
    password: true,
    title: "Password",
  });

  if (!username || !password) {
    vscode.window
      .showErrorMessage(
        "Both username and password are required",
        "Try again",
        "Cancel"
      )
      .then((selection) => {
        if (selection === "Try again") {
          login(context);
        } else {
          vscode.window.showInformationMessage("Login cancelled");
        }
      });
    return;
  }

  const res = await fetchToken(username, password);

  if (typeof res === "string") {
    vscode.window
      .showErrorMessage(
        `Login failed: ${res}`,
        "Try again",
        "Register",
        "Cancel"
      )
      .then((selection) => {
        if (selection === "Register") {
          register(context);
        } else if (selection === "Try again") {
          login(context);
        } else {
          vscode.window.showInformationMessage("Login cancelled");
        }
      });
    return;
  }

  const { access_token } = res;
  await storeToken(context, access_token);
  vscode.window.showInformationMessage("Logged in successfully");
};
export default login;
