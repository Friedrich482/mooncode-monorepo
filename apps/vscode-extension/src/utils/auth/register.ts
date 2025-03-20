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

  const confirmPassword = await vscode.window.showInputBox({
    prompt: "Confirm the password",
    password: true,
    placeHolder: "********",
    title: "confirmPassword",
    validateInput: (input) => {
      if (input && input !== password) {
        return "The passwords don't match";
      }
      return null;
    },
  });

  if (!username || !password || !email || password !== confirmPassword) {
    const selection = await vscode.window.showErrorMessage(
      "Both email, username and password are required. And both password should match",
      "Try again",
      "Cancel",
    );
    if (selection === "Try again") {
      await register(context);
    } else {
      vscode.window.showInformationMessage("Registration cancelled.");
    }
    return;
  }
  const res = await createUser(username, password, email);

  if (typeof res === "string") {
    const selection = await vscode.window.showErrorMessage(
      `Registering failed: ${res}`,
      "Try again",
      "Cancel",
    );
    if (selection === "Try again") {
      await register(context);
    } else {
      vscode.window.showInformationMessage("Registration cancelled.");
    }
    return;
  }
  const selection = await vscode.window.showInformationMessage(
    "Registered successfully",
    "Login",
  );
  if (selection === "Login") {
    await login();
  } else {
    return undefined;
  }
};

export default register;
