import * as vscode from "vscode";

const setStatusBarItem = (
  timeSpentToday: number,
  statusBarItem: vscode.StatusBarItem
) => {
  const minutesSpentToday = Math.floor((timeSpentToday % 3600) / 60);
  const hoursSpentToday = Math.floor(timeSpentToday / 3600);

  statusBarItem.text = `$(watch) ${
    hoursSpentToday !== 0
      ? `${hoursSpentToday} hr${hoursSpentToday !== 1 ? "s" : ""}`
      : ""
  } ${minutesSpentToday} min${minutesSpentToday !== 1 ? "s" : ""}`;
};

export default setStatusBarItem;
