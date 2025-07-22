import * as vscode from "vscode";
import { TRPCClientError } from "@trpc/client";
import calculateTime from "./calculateTime";
import getGlobalStateData from "./global-state/getGlobalStateData";
import getTodaysLocalDate from "@repo/common/getTodaysLocalDate";
import { isEqual } from "date-fns";
import setStatusBarItem from "./status-bar/setStatusBarItem";
import trpc from "./trpc/client";
import updateFilesDataAfterSync from "./files/updateFilesDataAfterSync";
import updateGlobalStateData from "./global-state/updateGlobalStateData";

const periodicSyncData = async (
  context: vscode.ExtensionContext,
  statusBarItem: vscode.StatusBarItem,
  getTime: Awaited<ReturnType<typeof calculateTime>>,
) => {
  const todaysDateString = getTodaysLocalDate();
  let lastServerSync = new Date();
  let isServerSynced = false;
  let timeSpentOnDay = 0;

  const filesDataToUpsert = getTime();

  const timeSpentToday = Object.values(filesDataToUpsert).reduce(
    (acc, value) => acc + value.elapsedTime,
    0,
  );

  timeSpentOnDay = timeSpentToday;

  const timeSpentPerLanguageToday = Object.entries(filesDataToUpsert).reduce(
    (acc, [, { elapsedTime, languageSlug }]) => {
      acc[languageSlug] = (acc[languageSlug] || 0) + elapsedTime;
      return acc;
    },
    {} as Record<string, number>,
  );

  const timeSpentPerProject = Object.entries(filesDataToUpsert)
    .map(([, fileData]) => ({
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
    Object.entries(filesDataToUpsert).map(
      ([
        filePath,
        { elapsedTime, languageSlug, projectName, projectPath, fileName },
      ]) => [
        filePath,
        {
          timeSpent: elapsedTime,
          languageSlug,
          projectName,
          projectPath,
          fileName,
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

    const upsertedLanguagesData = await trpc.codingStats.upsert.mutate({
      targetedDate: todaysDateString,
      timeSpentOnDay: timeSpentToday,
      timeSpentPerLanguage: timeSpentPerLanguageToday,
    });

    timeSpentOnDay = upsertedLanguagesData.timeSpentOnDay;

    const files = await trpc.filesStats.upsert.mutate({
      filesData: todayFilesData,
      targetedDate: todaysDateString,
      timeSpentPerProject,
    });
    updateFilesDataAfterSync(files);

    isServerSynced = true;
    lastServerSync = new Date();

    // ! Remove all the data (in the global state) for days previous to today if they exist
    // ! They do exist if the user stays offline and we change day

    await updateGlobalStateData({
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
      console.error(
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

      await updateGlobalStateData({
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
        `CRITICAL ERROR: Failed to save data to globalState : ${globalStateError}. Please open an issue to the GitHub repo of MoonCode.`,
      );
    }

    setStatusBarItem(timeSpentOnDay, statusBarItem);
  }
};

export default periodicSyncData;
