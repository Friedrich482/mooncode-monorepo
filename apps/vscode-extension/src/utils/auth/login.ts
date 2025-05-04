import * as vscode from "vscode";
import { LOGIN_URL } from "@repo/utils/constants";
import fetchJWTToken from "@repo/utils/fetchJWTToken";
import { getExtensionContext } from "../../extension";
import { loginResponseSchema } from "@repo/utils/schemas";
import register from "./register";
import storeToken from "./storeToken";

const login = async () => {
  const context = getExtensionContext();
  vscode.window.showInformationMessage("Logging in directly from vscode...");

  const email = await vscode.window.showInputBox({
    prompt: "Enter your email",
    title: "Email",
  });
  const password = await vscode.window.showInputBox({
    prompt: "Enter your password",
    password: true,
    title: "Password",
  });

  if (!email || !password) {
    const selection = await vscode.window.showErrorMessage(
      "Both email and password are required",
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
    vscode.window.showInformationMessage("Sending to endpoint...");

    // we can't use trpc here because we need to get the token first and it is what we're doing
    // using it will introduce a circular dependency problem :
    // trpc => token => login => trpc

    const body = await fetchJWTToken(LOGIN_URL, { email, password });
    const parsedBody = loginResponseSchema.parse(body);

    const {
      result: {
        data: {
          json: { access_token },
        },
      },
    } = parsedBody;

    await storeToken(context, access_token);
    vscode.window.showInformationMessage("Logged in successfully");
  } catch (error) {
    let errorMessage = "An error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    const selection = await vscode.window.showErrorMessage(
      `Login failed: ${errorMessage}`,
      "Try again",
      "Register",
      "Cancel",
    );

    if (selection === "Register") {
      await register();
    } else if (selection === "Try again") {
      await login();
    } else {
      vscode.window.showInformationMessage("Login cancelled");
    }
    return;
  }
};
export default login;
