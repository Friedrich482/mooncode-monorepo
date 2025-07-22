import * as vscode from "vscode";
import { getExtensionContext } from "@/extension";
import login from "./login";
import parseJwtPayload from "./parseJwtPayload";
import setLoginContext from "./setLoginContext";

const getToken = async () => {
  const context = getExtensionContext();

  let token = await context.secrets.get("authToken");

  const parsedPayload = parseJwtPayload(token);

  if (!parsedPayload.success) {
    await setLoginContext(false);

    vscode.window.showInformationMessage(
      "You're either logged out or your session has expired",
    );

    await login();
    token = await context.secrets.get("authToken");
    return token;
  }

  const { exp: expireDate } = parsedPayload.data;

  if (!token || expireDate * 1000 < Date.now()) {
    await setLoginContext(false);

    const selection = await vscode.window.showInformationMessage(
      "You are logged out. Please login",
      "Login",
    );

    if (selection !== "Login") {
      return undefined;
    }

    await login();
    token = await context.secrets.get("authToken");
  }

  await setLoginContext(true);

  return token;
};
export default getToken;
