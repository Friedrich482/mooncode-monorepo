import { SYNC_DATA_KEY, filesData, languagesData } from "../constants";
import { GlobalStateData } from "../types-schemas";
import { getExtensionContext } from "../extension";
import getTodaysLocalDate from "@repo/common/getTodaysLocalDate";

const isNewDayHandler = async (
  dailyData: GlobalStateData["dailyData"],
  lastServerSync: Date,
) => {
  const todaysDateString = getTodaysLocalDate();
  const context = getExtensionContext();

  if (!Object.hasOwn(dailyData, todaysDateString)) {
    Object.keys(languagesData).forEach((key) => {
      delete languagesData[key];
    });

    Object.keys(filesData).forEach((key) => {
      delete filesData[key];
    });

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
