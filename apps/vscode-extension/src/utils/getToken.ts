import * as vscode from "vscode";
import login from "./login";
import parseJwtPayload from "./parseJwtPayload";

const getToken = async (context: vscode.ExtensionContext) => {
  let token = await context.secrets.get("authToken");

  const parsedPayload = parseJwtPayload(token);

  if (!parsedPayload.success) {
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
