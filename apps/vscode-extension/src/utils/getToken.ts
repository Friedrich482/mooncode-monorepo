import * as vscode from "vscode";

const getToken = async (context: vscode.ExtensionContext) => {
  const token = await context.secrets.get("authToken");
  return token;
};

export default getToken;
