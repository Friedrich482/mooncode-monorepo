import * as vscode from "vscode";
import { SYNC_DATA_KEY } from "../constants";
import getTime from "./getTime";
import setStatusBarItem from "./setStatusBarItem";
import trpc from "./trpc/client";

const periodicSyncData = async (
  context: vscode.ExtensionContext,
  statusBarItem: vscode.StatusBarItem,
) => {
  const timeGetter = getTime();

  const timeSpentToday = Object.values(timeGetter()).reduce(
    (acc, value) => acc + value.elapsedTime,
    0,
  );
  const languagesToSync = Object.fromEntries(
    Object.entries(timeGetter()).map(([key, { elapsedTime }]) => [
      key,
      elapsedTime,
    ]),
  );

  // send the languages data to the server
  await trpc.codingStats.upsert.mutate({
    timeSpentToday,
    timeSpentPerLanguage: languagesToSync,
  });

  // save the languages in the vscode global state
  await context.globalState.update(SYNC_DATA_KEY, {
    timeSpentToday,
    timeSpentPerLanguage: languagesToSync,
  });

  setStatusBarItem(timeSpentToday, statusBarItem);
};

export default periodicSyncData;
