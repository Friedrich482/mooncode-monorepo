import * as vscode from "vscode";
import login from "./login";

const getToken = async (context: vscode.ExtensionContext) => {
  let token = await context.secrets.get("authToken");

  if (!token) {
    const selection = await vscode.window.showInformationMessage(
      "You are logged out. Do you want to log in?",
      "Login"
    );

    if (selection !== "Login") {
      return undefined;
    }

    await login(context);
    token = await context.secrets.get("authToken");
  }

  return token;
};
export default getToken;
