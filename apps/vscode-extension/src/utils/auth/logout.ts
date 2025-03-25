import * as vscode from "vscode";
import deleteToken from "./deleteToken";
import { getExtensionContext } from "../../extension";
const logout = async () => {
  const context = getExtensionContext();

  await deleteToken(context);
  vscode.window.showInformationMessage("Logged out");
};
export default logout;
