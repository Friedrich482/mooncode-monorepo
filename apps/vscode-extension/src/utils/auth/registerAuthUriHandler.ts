import { getExtensionContext } from "../../extension";
import storeToken from "./storeToken";
import vscode from "vscode";

const registerAuthUriHandler = () => {
  const context = getExtensionContext();
  vscode.window.registerUriHandler({
    async handleUri(uri: vscode.Uri) {
      if (uri.path === "/auth-callback") {
        const params = new URLSearchParams(uri.query);
        const token = params.get("token");
        const receivedState = params.get("state");

        const expectedState = await context.secrets.get("authState");

        if (
          !receivedState ||
          !expectedState ||
          receivedState !== expectedState
        ) {
          vscode.window.showErrorMessage(
            "Login Failed: auth state missing or incorrect",
          );
          await context.secrets.delete("authState");
          return;
        }

        if (token) {
          await storeToken(context, token);
          await context.secrets.delete("authState");

          await vscode.commands.executeCommand(
            "setContext",
            "MoonCode.isLoggedIn",
            true,
          );

          vscode.window.showInformationMessage("Logged in successfully");
        } else {
          vscode.window.showErrorMessage("Login failed: No token received.");
        }
      }
    },
  });
};

export default registerAuthUriHandler;
