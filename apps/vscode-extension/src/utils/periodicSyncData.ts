import * as vscode from "vscode";
import { SYNC_DATA_KEY } from "../constants";
import { TRPCClientError } from "@trpc/client";
import calculateTime from "./calculateTime";
import getGlobalStateData from "./getGlobalStateData";
import { isEqual } from "date-fns";
import setStatusBarItem from "./setStatusBarItem";
import trpc from "./trpc/client";

const periodicSyncData = async (
  context: vscode.ExtensionContext,
  statusBarItem: vscode.StatusBarItem,
  getTime: Awaited<ReturnType<typeof calculateTime>>,
) => {
  const todaysDateString = new Date().toLocaleDateString();
  let lastServerSync = new Date();
  let isServerSynced = false;

  const timeSpentToday = Object.values(getTime().languagesData).reduce(
    (acc, value) => acc + value.elapsedTime,
    0,
  );
  const timeSpentPerLanguageToday = Object.fromEntries(
    Object.entries(getTime().languagesData).map(([key, { elapsedTime }]) => [
      key,
      elapsedTime,
    ]),
  );

  const timeSpentPerProject = Object.entries(getTime().filesData)
    .map(([filePath, fileData]) => ({
      filePath,
      project: fileData.projectPath,
      timeSpent: fileData.elapsedTime,
    }))
    .reduce(
      (acc, value) => {
        if (acc[value.project]) {
          acc[value.project] += value.timeSpent;
        } else {
          acc[value.project] = value.timeSpent;
        }
        return acc;
      },
      {} as Record<string, number>,
    );
  const todayFilesData = Object.fromEntries(
    Object.entries(getTime().filesData).map(
      ([filePath, { elapsedTime, languageSlug, projectName, projectPath }]) => [
        filePath,
        {
          timeSpent: elapsedTime,
          languageSlug,
          projectName,
          projectPath,
        },
      ],
    ),
  );

  try {
    const globalStateData = await getGlobalStateData();

    // send the languages data to the server
    for (const [dateString, data] of Object.entries(
      globalStateData.dailyData,
    )) {
      // we send the data of older dates if found
      if (!isEqual(new Date(dateString), new Date(todaysDateString))) {
        await trpc.codingStats.upsert.mutate({
          targetedDate: dateString,
          timeSpentOnDay: data.timeSpentOnDay,
          timeSpentPerLanguage: data.timeSpentPerLanguage,
        });

        const perProject = Object.values(data.dayFilesData).reduce(
          (acc, { projectPath, timeSpent }) => {
            acc[projectPath] = (acc[projectPath] || 0) + timeSpent;
            return acc;
          },
          {} as Record<string, number>,
        );
        await trpc.filesStats.upsert.mutate({
          filesData: data.dayFilesData,
          targetedDate: dateString,
          timeSpentPerProject: perProject,
        });
      }
    }

    await trpc.codingStats.upsert.mutate({
      targetedDate: todaysDateString,
      timeSpentOnDay: timeSpentToday,
      timeSpentPerLanguage: timeSpentPerLanguageToday,
    });

    await trpc.filesStats.upsert.mutate({
      filesData: todayFilesData,
      targetedDate: todaysDateString,
      timeSpentPerProject,
    });

    isServerSynced = true;
    lastServerSync = new Date();

    // ! Remove all the data (in the global state) for days previous to today if they exist
    // ! They do exist if the user stays offline and we change day

    await context.globalState.update(SYNC_DATA_KEY, {
      lastServerSync,
      dailyData: {
        [todaysDateString]: {
          timeSpentOnDay: timeSpentToday,
          timeSpentPerLanguage: timeSpentPerLanguageToday,
          dayFilesData: todayFilesData,
          updatedAt: new Date(),
        },
      },
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

      const globalStateData = await getGlobalStateData();

      await context.globalState.update(SYNC_DATA_KEY, {
        lastServerSync: isServerSynced
          ? lastServerSync
          : globalStateData.lastServerSync,
        dailyData: {
          ...globalStateData.dailyData,
          [todaysDateString]: {
            timeSpentOnDay: timeSpentToday,
            timeSpentPerLanguage: timeSpentPerLanguageToday,
            dayFilesData: todayFilesData,
            updatedAt: new Date(),
          },
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
