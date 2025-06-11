import { SYNC_DATA_KEY, filesData, languagesData } from "../constants";
import { GlobalStateData } from "../types-schemas";
import { getExtensionContext } from "../extension";

const isNewDayHandler = async (
  dailyData: GlobalStateData["dailyData"],
  lastServerSync: Date,
) => {
  const todaysDateString = new Date().toLocaleDateString();

  if (!Object.hasOwn(dailyData, todaysDateString)) {
    Object.keys(languagesData).map((language) => {
      delete languagesData[language];
    });

    Object.keys(filesData).map((file) => {
      delete filesData[file];
    });

    const context = getExtensionContext();

    const newGlobalStateData = {
      lastServerSync,
      dailyData: {
        ...dailyData,
        [todaysDateString]: {
          timeSpentOnDay: 0,
          timeSpentPerLanguage: {},
          dayFilesData: {},
          updatedAt: new Date(),
        },
      },
    };

    await context.globalState.update(SYNC_DATA_KEY, newGlobalStateData);

    return newGlobalStateData;
  }
};

export default isNewDayHandler;
