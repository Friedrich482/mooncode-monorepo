import * as vscode from "vscode";
import getTime from "./utils/getTime";
import getToken from "./utils/getToken";

const periodicSyncData = async (
  context: vscode.ExtensionContext,
  body: unknown,
  statusBarItem: vscode.StatusBarItem
) => {
  const timeGetter = getTime();
  const timeSpentPerLanguage = Object.fromEntries(
    Object.entries(timeGetter()).map(([key, { elapsedTime }]) => [
      key,
      elapsedTime,
    ])
  );
  const timeSpentToday = Object.values(timeSpentPerLanguage).reduce(
    (acc, value) => acc + value,
    0
  );
  const minutesSpentToday = Math.floor((timeSpentToday % 3600) / 60);
  const hoursSpentToday = Math.floor(timeSpentToday / 3600);

  const authToken = await getToken(context);

  const res = await fetch("http://localhost:3000/api/coding-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      timeSpentToday,
      timeSpentPerLanguage: Object.fromEntries(
        Object.entries(timeGetter()).map(([key, { elapsedTime }]) => [
          key,
          elapsedTime,
        ])
      ),
    }),
  });

  body = await res.json();

  statusBarItem.text = `$(watch) ${
    hoursSpentToday !== 0
      ? `${hoursSpentToday} hr${hoursSpentToday !== 1 ? "s" : ""}`
      : ""
  } ${minutesSpentToday} min${minutesSpentToday !== 1 ? "s" : ""}`;
  return body;
};

export default periodicSyncData;
