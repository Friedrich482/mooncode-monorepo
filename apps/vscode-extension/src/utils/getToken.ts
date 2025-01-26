import * as vscode from "vscode";

const getToken = async (context: vscode.ExtensionContext) => {
  const token = await context.secrets.get("authToken");
  vscode.window.showInformationMessage(JSON.stringify(token));
  return token;
};

export default getToken;
