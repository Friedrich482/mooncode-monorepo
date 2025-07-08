import vscode from "vscode";

const deleteToken = async (context: vscode.ExtensionContext) => {
  await context.secrets.delete("authToken");
};

export default deleteToken;
