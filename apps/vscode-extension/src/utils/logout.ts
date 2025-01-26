import * as vscode from "vscode";
import deleteToken from "./deleteToken";
const logout = async (context: vscode.ExtensionContext) => {
  await deleteToken(context);
  vscode.window.showInformationMessage("Logged out");
};
export default logout;
