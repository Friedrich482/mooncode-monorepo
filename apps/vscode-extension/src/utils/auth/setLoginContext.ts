import vscode from "vscode";

const setLoginContext = async (state: boolean) => {
  await vscode.commands.executeCommand(
    "setContext",
    "MoonCode.isLoggedIn",
    state,
  );
};

export default setLoginContext;
