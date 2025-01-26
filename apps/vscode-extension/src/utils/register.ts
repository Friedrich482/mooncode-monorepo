import * as vscode from "vscode";
import createUser from "./createUser";
import login from "./login";
const register = async (context: vscode.ExtensionContext) => {
  const username = await vscode.window.showInputBox({
    prompt: "Enter your username",
    title: "Username",
  });
  const email = await vscode.window.showInputBox({
    prompt: "Enter your email",
    title: "Email",
    placeHolder: "example@email.com",
  });
  const password = await vscode.window.showInputBox({
    prompt: "Enter your password",
    password: true,
    placeHolder: "********",
    title: "Password",
    validateInput: (input) => {
      if (input && input.length < 8) {
        return "Password should be at least 8 characters long.";
      }
      return null;
    },
  });

  if (!username || !password || !email) {
    vscode.window.showErrorMessage("Email, username and password are required");
    vscode.window
      .showInformationMessage("Try again", "Register", "Cancel")
      .then((selection) => {
        if (selection === "Register") {
          register(context);
        } else {
          vscode.window.showInformationMessage("Registration cancelled.");
        }
      });
    return;
  }
  const res = await createUser(username, password, email);
  if (typeof res === "string") {
    vscode.window.showErrorMessage(`Registering failed ${res}`);
    vscode.window
      .showInformationMessage("Try again", "Register", "Cancel")
      .then((selection) => {
        if (selection === "Register") {
          register(context);
        } else {
          vscode.window.showInformationMessage("Registration cancelled.");
        }
      });
    return;
  }
  vscode.window.showInformationMessage("Now,login");
  await login(context);
};

export default register;
