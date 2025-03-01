import * as vscode from "vscode";
import formatDuration from "@repo/utils/formatDuration";

const setStatusBarItem = (
  timeSpentToday: number,
  statusBarItem: vscode.StatusBarItem,
) => {
  statusBarItem.text = `$(watch) ${formatDuration(timeSpentToday)}`;
};

export default setStatusBarItem;
