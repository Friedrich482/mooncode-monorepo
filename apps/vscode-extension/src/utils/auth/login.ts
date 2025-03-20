import * as vscode from "vscode";
import { TRPCClientError } from "@trpc/client";
import { getExtensionContext } from "../../extension";
import register from "./register";
import storeToken from "./storeToken";
import trpc from "../trpc/client";

const login = async () => {
  const context = getExtensionContext();
  vscode.window.showInformationMessage("Logging in directly from vscode...");

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
      "Cancel",
    );
    if (selection === "Try again") {
      await login();
    } else {
      vscode.window.showInformationMessage("Login cancelled");
    }
    return;
  }

  try {
    const res = await trpc.auth.signInUser.mutate({ username, password });
    const { access_token } = res;

    await storeToken(context, access_token);
    vscode.window.showInformationMessage("Logged in successfully");
  } catch (error) {
    let errorMessage;
    if (error instanceof TRPCClientError || error instanceof Error) {
      errorMessage = error.message;
    }

    const selection = await vscode.window.showErrorMessage(
      `Login failed: ${errorMessage}`,
      "Try again",
      "Register",
      "Cancel",
    );

    if (selection === "Register") {
      await register(context);
    } else if (selection === "Try again") {
      await login();
    } else {
      vscode.window.showInformationMessage("Login cancelled");
    }
    return;
  }
};
export default login;
