import * as vscode from "vscode";
import { SYNC_DATA_KEY, filesData, languagesData } from "../../constants";
import deleteToken from "./deleteToken";
import { getExtensionContext } from "../../extension";
import login from "./login";
import setLoginContext from "./setLoginContext";
const logout = async () => {
  const context = getExtensionContext();

  await deleteToken(context);

  await setLoginContext(false);

  //  purge the local data of the current user
  Object.keys(languagesData).forEach((key) => {
    delete languagesData[key];
  });

  Object.keys(filesData).forEach((key) => {
    delete filesData[key];
  });

  const todaysDateString = new Date().toLocaleDateString();
  await context.globalState.update(SYNC_DATA_KEY, {
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
