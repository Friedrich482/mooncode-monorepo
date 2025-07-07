import * as vscode from "vscode";
import deleteToken from "./deleteToken";
import { getExtensionContext } from "../../extension";
import login from "./login";
import setLoginContext from "./setLoginContext";
const logout = async () => {
  const context = getExtensionContext();

  await deleteToken(context);

  await setLoginContext(false);

  const selection = await vscode.window.showInformationMessage(
    "Logged out",
    "Login",
    "Cancel",
  );

  if (selection === "Login") {
    await login();
  } else {
    return;
  }
};
export default logout;
