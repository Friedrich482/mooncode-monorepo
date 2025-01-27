import * as vscode from "vscode";
import { localUrl, localUrlPort } from "../constants";

const openDashBoard = async () => {
  const success = await vscode.env.openExternal(vscode.Uri.parse(localUrl));
  if (success) {
    vscode.window.showInformationMessage(
      `Dashboard is running on the port ${localUrlPort}`
    );
  } else {
    vscode.window.showErrorMessage("Failed to open the dashboard locally");
  }
};

export default openDashBoard;
