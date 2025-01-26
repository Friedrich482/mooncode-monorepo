import * as vscode from "vscode";
const storeToken = async (context: vscode.ExtensionContext, token: string) => {
  await context.secrets.store("authToken", token);
};

export default storeToken;
