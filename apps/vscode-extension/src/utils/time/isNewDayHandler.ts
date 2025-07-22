import { GlobalStateData } from "@/types-schemas";
import deleteFilesDataContent from "../files/deleteFilesDataContent";
import getTodaysLocalDate from "@repo/common/getTodaysLocalDate";
import updateGlobalStateData from "../global-state/updateGlobalStateData";

const isNewDayHandler = async (
  dailyData: GlobalStateData["dailyData"],
  lastServerSync: Date,
) => {
  const todaysDateString = getTodaysLocalDate();

  if (!Object.hasOwn(dailyData, todaysDateString)) {
    deleteFilesDataContent();

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

    await updateGlobalStateData(newGlobalStateData);

    return newGlobalStateData;
  }
};

export default isNewDayHandler;
