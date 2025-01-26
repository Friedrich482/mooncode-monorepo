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
    vscode.window.showErrorMessage("Username and password are required");
    return;
  }

  const res = await fetchToken(username, password);
  if (typeof res === "string") {
    vscode.window.showErrorMessage(`Login failed: ${res}`);
    vscode.window
      .showInformationMessage("Do you want to register?", "Register")
      .then((selection) => {
        if (selection === "Register") {
          register(context);
        } else {
          vscode.window.showInformationMessage("Registration cancelled.");
        }
      });
    return;
  }
  const { access_token } = res;
  await storeToken(context, access_token);
  vscode.window.showInformationMessage("Logged in successfully");
};
export default login;
