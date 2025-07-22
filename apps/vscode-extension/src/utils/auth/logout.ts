import * as vscode from "vscode";
import deleteToken from "./deleteToken";
import { filesData } from "@/constants";
import { getExtensionContext } from "@/extension";
import getTodaysLocalDate from "@repo/common/getTodaysLocalDate";
import login from "./login";
import setLoginContext from "./setLoginContext";
import updateGlobalStateData from "@/utils/global-state/updateGlobalStateData";

const logout = async () => {
  //!! add a warning to prevent the user that all local data will be lost
  try {
    const context = getExtensionContext();

    await deleteToken(context);

    await setLoginContext(false);

    //  purge the local data of the current user

    Object.keys(filesData).forEach((key) => {
      delete filesData[key];
    });

    const todaysDateString = getTodaysLocalDate();
    await updateGlobalStateData({
      lastServerSync: new Date(),
      dailyData: {
        [todaysDateString]: {
          timeSpentOnDay: 0,
          timeSpentPerLanguage: {},
          dayFilesData: {},
          updatedAt: new Date(),
        },
      },
    });
  } catch (error) {
    vscode.window.showErrorMessage(
      `Logout failed: ${error instanceof Error ? error.message : error}`,
    );
    return;
  }

  const selection = await vscode.window.showInformationMessage(
    "Logged out",
    "Login",
    "Cancel",
  );

  if (selection === "Login") {
    await login();
  } else {
    return;
  }
};
export default logout;
