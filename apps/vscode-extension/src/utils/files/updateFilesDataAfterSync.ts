import type { AppRouter } from "@repo/trpc/router";
import { filesData } from "../../constants";

const updateFilesDataAfterSync = async (
  files: Awaited<ReturnType<AppRouter["filesStats"]["upsert"]>>,
) => {
  Object.keys(files).forEach((filePath) => {
    const file = files[filePath];
    filesData[filePath].elapsedTime = file.timeSpent;
  });
};

export default updateFilesDataAfterSync;
