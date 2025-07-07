import * as vscode from "vscode";
import { getDashboardPort, getExtensionContext } from "../../extension";
import crypto from "crypto";

const login = async () => {
  const context = getExtensionContext();
  const dashboardPort = getDashboardPort();

  try {
    const state = crypto.randomBytes(32).toString("base64url");
    const publisher = context.extension.id.split(".")[0];
    const extensionId = context.extension.id.split(".")[1];

    const callbackUri = await vscode.env.asExternalUri(
      vscode.Uri.parse(
        `vscode://${publisher}.${extensionId}/auth-callback?state=${state}`,
      ),
    );

    const dashboardLoginUrl = vscode.Uri.parse(
      `http://localhost:${dashboardPort}/login?callback=${encodeURIComponent(callbackUri.toString())}`,
    );

    await context.secrets.store("authState", state);

    const selection = await vscode.window.showInformationMessage(
      "Open the local dashboard to login",
      "open dashboard",
    );

    if (!selection) {
      return;
    }

    if (selection === "open dashboard") {
      vscode.env.openExternal(dashboardLoginUrl);
    }
  } catch (error) {
    vscode.window.showErrorMessage(
      `An error occurred: ${error instanceof Error ? error.message : error}`,
    );
  }
};

export default login;
