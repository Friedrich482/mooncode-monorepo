import { GlobalStateData } from "@/types-schemas";
import { SYNC_DATA_KEY } from "@/constants";
import { getExtensionContext } from "@/extension";

const updateGlobalStateData = async (data: GlobalStateData) => {
  const context = getExtensionContext();
  await context.globalState.update(SYNC_DATA_KEY, data);
};

export default updateGlobalStateData;
