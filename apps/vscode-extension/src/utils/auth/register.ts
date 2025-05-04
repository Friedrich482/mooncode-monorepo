import * as vscode from "vscode";
import { REGISTER_URL } from "@repo/utils/constants";
import fetchJWTToken from "@repo/utils/fetchJWTToken";
import { getExtensionContext } from "../../extension";
import { loginResponseSchema } from "@repo/utils/schemas";
import storeToken from "./storeToken";

const register = async () => {
  const context = getExtensionContext();

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
    const selection = await vscode.window.showErrorMessage(
      "Both email, username and password are required",
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
    // we can't use trpc here for the same reasons as the login function
    const body = await fetchJWTToken(REGISTER_URL, {
      email,
      password,
      username,
    });
    const parsedBody = loginResponseSchema.parse(body);

    const {
      result: {
        data: {
          json: { access_token },
        },
      },
    } = parsedBody;

    await storeToken(context, access_token);
    vscode.window.showInformationMessage(
      "Register completed.Logged in successfully",
    );
  } catch (error) {
    let errorMessage = "An error occurred";

    if (error instanceof Error) {
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
