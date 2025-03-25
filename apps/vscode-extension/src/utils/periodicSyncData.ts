import * as vscode from "vscode";
import getTime from "./getTime";
import setStatusBarItem from "./setStatusBarItem";
import trpc from "./trpc/client";

const periodicSyncData = async (
  context: vscode.ExtensionContext,
  body: unknown,
  statusBarItem: vscode.StatusBarItem,
) => {
  const timeGetter = getTime();
  const timeSpentToday = Object.values(timeGetter()).reduce(
    (acc, value) => acc + value.elapsedTime,
    0,
  );

  const res = await trpc.codingData.upsert.mutate({
    timeSpentToday,
    timeSpentPerLanguage: Object.fromEntries(
      Object.entries(timeGetter()).map(([key, { elapsedTime }]) => [
        key,
        elapsedTime,
      ]),
    ),
  });

  body = res;

  setStatusBarItem(timeSpentToday, statusBarItem);

  return body;
};

export default periodicSyncData;
