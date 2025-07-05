import formatDuration from "@repo/utils/formatDuration";
import vscode from "vscode";

const setStatusBarItem = (
  timeSpentToday: number,
  statusBarItem: vscode.StatusBarItem,
) => {
  statusBarItem.text = `$(watch) ${formatDuration(timeSpentToday)}`;
};

export default setStatusBarItem;
