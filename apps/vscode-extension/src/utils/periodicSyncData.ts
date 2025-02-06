import * as vscode from "vscode";
import getTime from "./getTime";
import getToken from "./getToken";

const periodicSyncData = async (
  context: vscode.ExtensionContext,
  body: unknown,
  statusBarItem: vscode.StatusBarItem
) => {
  const timeGetter = getTime();
  const timeSpentPerLanguage = Object.fromEntries(
    Object.entries(timeGetter()).map(([key, { elapsedTime }]) => {
      const now = new Date();
      // check if it is 00:00
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        return [key, 0];
      }
      return [key, elapsedTime];
    })
  );
  const timeSpentToday = Object.values(timeSpentPerLanguage).reduce(
    (acc, value) => acc + value,
    0
  );
  const minutesSpentToday = Math.floor((timeSpentToday % 3600) / 60);
  const hoursSpentToday = Math.floor(timeSpentToday / 3600);

  const authToken = await getToken(context);
  // all times are sent in minutes
  const res = await fetch("http://localhost:3000/api/coding-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      timeSpentToday: minutesSpentToday,
      timeSpentPerLanguage: Object.fromEntries(
        Object.entries(timeGetter()).map(([key, { elapsedTime }]) => [
          key,
          Math.floor((elapsedTime % 3600) / 60),
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
