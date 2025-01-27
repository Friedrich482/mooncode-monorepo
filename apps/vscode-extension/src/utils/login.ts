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
    const selection = await vscode.window.showErrorMessage(
      "Both username and password are required",
      "Try again",
      "Cancel"
    );
    if (selection === "Try again") {
      await login(context);
    } else {
      vscode.window.showInformationMessage("Login cancelled");
    }
    return;
  }

  const res = await fetchToken(username, password);

  if (typeof res === "string") {
    const selection = await vscode.window.showErrorMessage(
      `Login failed: ${res}`,
      "Try again",
      "Register",
      "Cancel"
    );
    if (selection === "Register") {
      await register(context);
    } else if (selection === "Try again") {
      await login(context);
    } else {
      vscode.window.showInformationMessage("Login cancelled");
    }
    return;
  }

  const { access_token } = res;
  await storeToken(context, access_token);
  vscode.window.showInformationMessage("Logged in successfully");
};
export default login;
