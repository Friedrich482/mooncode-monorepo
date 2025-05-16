import * as vscode from "vscode";
import { SYNC_DATA_KEY } from "../constants";
import { TRPCClientError } from "@trpc/client";
import { globalStateInitialDataSchema } from "../types-schemas";
import trpc from "./trpc/client";

const fetchInitialData = async (context: vscode.ExtensionContext) => {
  const dateString = new Date().toLocaleDateString();

  let timeSpentFromServer = 0;
  let initialLanguagesDataFromServer: Record<string, number> = {};
  let serverDataFetchedSuccessfully = false;

  try {
    const { dayLanguagesTime, timeSpent } =
      await trpc.codingStats.getDailyStatsForExtension.query({
        dateString: dateString,
      });

    timeSpentFromServer = timeSpent;
    initialLanguagesDataFromServer = dayLanguagesTime;
    serverDataFetchedSuccessfully = true;
  } catch (error) {
    if (error instanceof TRPCClientError) {
      vscode.window.showErrorMessage(
        `tRPC Error: ${error.message}, Cause:, ${error.cause}`,
      );
    } else {
      vscode.window.showErrorMessage(
        `Unknown error during server fetch:", ${error}`,
      );
    }
  }

  const globalStateDataRaw = context.globalState.get(SYNC_DATA_KEY);

  const parsedGlobalStateInitialData =
    globalStateInitialDataSchema.safeParse(globalStateDataRaw);

  let timeSpentFromGlobalState = 0;
  let initialLanguagesDataFromGlobalState: Record<string, number> = {};

  if (parsedGlobalStateInitialData.success) {
    const { timeSpentOnDay, timeSpentPerLanguage } =
      parsedGlobalStateInitialData.data.dailyData[dateString];

    timeSpentFromGlobalState = timeSpentOnDay;
    initialLanguagesDataFromGlobalState = timeSpentPerLanguage;
  }

  if (serverDataFetchedSuccessfully) {
    if (timeSpentFromServer >= timeSpentFromGlobalState) {
      // Server wins
      return {
        timeSpent: timeSpentFromServer,
        initialLanguagesData: initialLanguagesDataFromServer,
      };
    }
    // Global state wins
    return {
      timeSpent: timeSpentFromGlobalState,
      initialLanguagesData: initialLanguagesDataFromGlobalState,
    };
  } else {
    // Server data is NOT available, must use global state data
    vscode.window.showInformationMessage(
      "Server is unavailable, using the global state instead",
    );
    return {
      timeSpent: timeSpentFromGlobalState,
      initialLanguagesData: initialLanguagesDataFromGlobalState,
    };
  }
};

export default fetchInitialData;
