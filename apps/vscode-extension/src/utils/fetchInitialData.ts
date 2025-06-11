import * as vscode from "vscode";
import { TRPCClientError } from "@trpc/client";
import getGlobalStateData from "./getGlobalStateData";
import trpc from "./trpc/client";

const fetchInitialData = async () => {
  const dateString = new Date().toLocaleDateString();

  let timeSpentFromGlobalState = 0;
  let initialLanguagesDataFromGlobalState: Record<string, number> = {};

  let timeSpentFromServer = 0;
  let initialLanguagesDataFromServer: Record<string, number> = {};
  let serverDataFetchedSuccessfully = false;
  let initialFilesData: Record<
    string,
    {
      timeSpent: number;
      projectPath: string;
      language: string;
      projectName: string;
    }
  > = {};

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
    initialFilesData = dayFilesData;
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

  const { timeSpentOnDay, timeSpentPerLanguage } = globalStateData.dailyData[
    dateString
  ] ?? {
    timeSpentOnDay: 0,
    timeSpentPerLanguage: {},
  };

  timeSpentFromGlobalState = timeSpentOnDay;
  initialLanguagesDataFromGlobalState = timeSpentPerLanguage;

  if (serverDataFetchedSuccessfully) {
    if (timeSpentFromServer >= timeSpentFromGlobalState) {
      // Server wins
      return {
        timeSpent: timeSpentFromServer,
        initialLanguagesData: initialLanguagesDataFromServer,
        initialFilesData,
      };
    }

    // Global state wins
    return {
      timeSpent: timeSpentFromGlobalState,
      initialLanguagesData: initialLanguagesDataFromGlobalState,
      initialFilesData,
    };
  } else {
    // Server data is NOT available, must use global state data
    vscode.window.showInformationMessage(
      "Server is unavailable, using the global state instead",
    );

    return {
      timeSpent: timeSpentFromGlobalState,
      initialLanguagesData: initialLanguagesDataFromGlobalState,
      initialFilesData,
    };
  }
};

export default fetchInitialData;
