import * as vscode from "vscode";

const deleteToken = async (context: vscode.ExtensionContext) => {
  await context.secrets.delete("authToken");
  vscode.window.showInformationMessage("Token deleted");
};

export default deleteToken;
