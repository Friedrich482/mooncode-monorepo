import * as vscode from "vscode";
const storeToken = async (context: vscode.ExtensionContext, token: string) => {
  await context.secrets.store("authToken", token);
  vscode.window.showInformationMessage("Token stored successfully");
};

export default storeToken;
