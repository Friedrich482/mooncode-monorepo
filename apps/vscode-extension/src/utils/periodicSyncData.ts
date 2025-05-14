import * as vscode from "vscode";
import { SYNC_DATA_KEY } from "../constants";
import { TRPCClientError } from "@trpc/client";
import getTime from "./getTime";
import { globalStateInitialDataSchema } from "../types-schemas";
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

  try {
    // send the languages data to the server
    await trpc.codingStats.upsert.mutate({
      timeSpentToday,
      timeSpentPerLanguage: languagesToSync,
    });
  } catch (error) {
    if (error instanceof TRPCClientError) {
      vscode.window.showWarningMessage(
        `tRPC Error during sync: ${error.message}, Cause: ${error.cause}.`,
      );
    } else {
      vscode.window.showWarningMessage(
        `Unknown error during server sync: ${error}.`,
      );
    }
  } finally {
    try {
      // save the languages data in the vscode global state
      const todaysDateString = new Date().toLocaleDateString();

      const globalStateData = globalStateInitialDataSchema.parse(
        await context.globalState.get(SYNC_DATA_KEY),
      );

      await context.globalState.update(SYNC_DATA_KEY, {
        ...globalStateData,
        [todaysDateString]: {
          timeSpentToday,
          timeSpentPerLanguage: languagesToSync,
          updatedAt: new Date(),
        },
      });
    } catch (globalStateError) {
      vscode.window.showErrorMessage(
        `CRITICAL ERROR: Failed to save data to globalState : ${globalStateError}. Please open an issue to the Github repo of MoonCode.`,
      );
    }
    setStatusBarItem(timeSpentToday, statusBarItem);
  }
};

export default periodicSyncData;
