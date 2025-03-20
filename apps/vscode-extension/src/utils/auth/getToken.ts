import * as vscode from "vscode";
import { getExtensionContext } from "../../extension";
import login from "./login";
import parseJwtPayload from "./parseJwtPayload";

const getToken = async () => {
  const context = getExtensionContext();

  let token = await context.secrets.get("authToken");

  const parsedPayload = parseJwtPayload(token);

  if (!parsedPayload.success) {
    vscode.window.showInformationMessage(
      "You're either logged out or your session has expired",
    );
    await login(context);
    token = await context.secrets.get("authToken");
    return token;
  }

  const { exp: expireDate } = parsedPayload.data;

  if (!token || expireDate * 1000 < Date.now()) {
    const selection = await vscode.window.showInformationMessage(
      "You are logged out. Do you want to log in?",
      "Login",
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
