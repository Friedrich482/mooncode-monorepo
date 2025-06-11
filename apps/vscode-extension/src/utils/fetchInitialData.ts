import * as vscode from "vscode";
import { FileDataSync } from "../types-schemas";
import { TRPCClientError } from "@trpc/client";
import getGlobalStateData from "./getGlobalStateData";
import trpc from "./trpc/client";

const fetchInitialData = async () => {
  const dateString = new Date().toLocaleDateString();

  let timeSpentFromGlobalState = 0;
  let initialLanguagesDataFromGlobalState: Record<string, number> = {};
  let initialFilesDataFromGlobalState: FileDataSync = {};

  let timeSpentFromServer = 0;
  let initialLanguagesDataFromServer: Record<string, number> = {};
  let initialFilesDataFromServer: FileDataSync = {};

  let serverDataFetchedSuccessfully = false;

  try {
    const { dayLanguagesTime, timeSpent } =
      await trpc.codingStats.getDailyStatsForExtension.query({
        dateString,
      });

    const dayFilesData =
      await trpc.filesStats.getDailyFilesStatsForExtension.query({
        dateString,
      });

    timeSpentFromServer = timeSpent;
    initialLanguagesDataFromServer = dayLanguagesTime;
    initialFilesDataFromServer = dayFilesData;

    serverDataFetchedSuccessfully = true;
  } catch (error) {
    if (error instanceof TRPCClientError) {
      vscode.window.showErrorMessage(
        `tRPC Error: ${error.message}, Cause: ${error.cause}`,
      );
    } else {
      vscode.window.showErrorMessage(
        `Unknown error during server fetch: ${error}`,
      );
    }
  }

  const globalStateData = await getGlobalStateData();

  const { timeSpentOnDay, timeSpentPerLanguage, dayFilesData } = globalStateData
    .dailyData[dateString] ?? {
    timeSpentOnDay: 0,
    timeSpentPerLanguage: {},
    dayFilesData: {},
  };

  timeSpentFromGlobalState = timeSpentOnDay;
  initialLanguagesDataFromGlobalState = timeSpentPerLanguage;
  initialFilesDataFromGlobalState = dayFilesData;

  if (serverDataFetchedSuccessfully) {
    if (timeSpentFromServer >= timeSpentFromGlobalState) {
      // Server wins
      return {
        timeSpent: timeSpentFromServer,
        initialLanguagesData: initialLanguagesDataFromServer,
        initialFilesData: initialFilesDataFromServer,
      };
    }

    // Global state wins
    return {
      timeSpent: timeSpentFromGlobalState,
      initialLanguagesData: initialLanguagesDataFromGlobalState,
      initialFilesData: initialFilesDataFromGlobalState,
    };
  } else {
    // Server data is NOT available, must use global state data
    vscode.window.showInformationMessage(
      "Server is unavailable, using the global state instead",
    );

    return {
      timeSpent: timeSpentFromGlobalState,
      initialLanguagesData: initialLanguagesDataFromGlobalState,
      initialFilesData: initialFilesDataFromGlobalState,
    };
  }
};

export default fetchInitialData;
