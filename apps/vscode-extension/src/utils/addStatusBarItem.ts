import * as vscode from "vscode";
const addStatusBarItem = () => {
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    200,
  );
  statusBarItem.text = "$(watch) MoonCode";
  statusBarItem.tooltip =
    "MoonCode: Time spent coding today. Click to open your dashboard";
  statusBarItem.command = "MoonCode.openDashBoard";
  statusBarItem.show();

  return statusBarItem;
};
export default addStatusBarItem;
