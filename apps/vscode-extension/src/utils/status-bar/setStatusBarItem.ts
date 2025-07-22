import formatDuration from "@repo/common/formatDuration";
import vscode from "vscode";

const setStatusBarItem = (
  timeSpentToday: number,
  statusBarItem: vscode.StatusBarItem,
) => {
  statusBarItem.text = `$(watch) ${formatDuration(timeSpentToday)}`;
};

export default setStatusBarItem;
