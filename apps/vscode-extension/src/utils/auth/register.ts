import * as vscode from "vscode";
import { TRPCClientError } from "@trpc/client";
import login from "./login";
import trpc from "../trpc/client";

const register = async () => {
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
      await register();
    } else {
      vscode.window.showInformationMessage("Registration cancelled.");
    }
    return;
  }

  try {
    await trpc.auth.registerUser.mutate({
      email,
      username,
      password,
    });

    const selection = await vscode.window.showInformationMessage(
      "Registered successfully",
      "Login",
    );

    if (selection === "Login") {
      await login();
    } else {
      return;
    }
  } catch (error) {
    let errorMessage = "An error occurred";

    if (error instanceof TRPCClientError || error instanceof Error) {
      errorMessage = error.message;
    }

    const selection = await vscode.window.showErrorMessage(
      `Registering failed: ${errorMessage}`,
      "Try again",
      "Cancel",
    );

    if (selection === "Try again") {
      await register();
    } else {
      vscode.window.showInformationMessage("Registration cancelled.");
    }
  }

  return;
};

export default register;
