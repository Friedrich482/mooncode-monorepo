import { SYNC_DATA_KEY } from "../constants";
import { getExtensionContext } from "../extension";

import { globalStateInitialDataSchema } from "../types-schemas";

const getGlobalStateData = async () => {
  const context = getExtensionContext();
  try {
    const globalStateData = globalStateInitialDataSchema.parse(
      await context.globalState.get(SYNC_DATA_KEY),
    );

    return globalStateData;
  } catch (error) {
    throw new Error(`Invalid data shape: ${error}`);
  }
};

export default getGlobalStateData;
