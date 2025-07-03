import * as vscode from "vscode";
import { DASHBOARD_URL } from "@repo/utils/constants";

const openDashboard = async () => {
  try {
    const success = await vscode.env.openExternal(
      vscode.Uri.parse(DASHBOARD_URL),
    );
    if (success) {
      vscode.window.showInformationMessage(
        `Opening dashboard at ${DASHBOARD_URL}`,
      );
    } else {
      vscode.window.showErrorMessage("Failed to open the dashboard URL");
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Error opening dashboard: ${error}`);
  }
};

export default openDashboard;
