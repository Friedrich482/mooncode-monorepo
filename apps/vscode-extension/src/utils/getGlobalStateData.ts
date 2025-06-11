import * as vscode from "vscode";
import {
  GlobalStateData,
  globalStateInitialDataSchema,
} from "../types-schemas";
import { SYNC_DATA_KEY } from "../constants";
import { getExtensionContext } from "../extension";

const getGlobalStateData: () => Promise<GlobalStateData> = async () => {
  const context = getExtensionContext();
  const todaysDateString = new Date().toLocaleDateString();

  try {
    const globalStateData = globalStateInitialDataSchema.parse(
      await context.globalState.get(SYNC_DATA_KEY),
    );

    return globalStateData;
  } catch (error) {
    vscode.window.showErrorMessage(
      `Invalid data shape: ${error}. Defaulting to default data`,
    );

    return {
      lastServerSync: new Date(),
      dailyData: {
        [todaysDateString]: {
          timeSpentOnDay: 0,
          timeSpentPerLanguage: {},
          dayFilesData: {},
          updatedAt: new Date(),
        },
      },
    };
  }
};

export default getGlobalStateData;
