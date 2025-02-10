import * as vscode from "vscode";
import { PERIODIC_DATA_SYNC_URL } from "../constants";
import getTime from "./getTime";
import getToken from "./getToken";
import setStatusBarItem from "./setStatusBarItem";

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

  const authToken = await getToken(context);
  const res = await fetch(PERIODIC_DATA_SYNC_URL, {
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

  setStatusBarItem(timeSpentToday, statusBarItem);

  return body;
};

export default periodicSyncData;
