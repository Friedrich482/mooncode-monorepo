import type { AppRouter } from "@repo/trpc/router";
import { filesData } from "@/constants";

const updateFilesDataAfterSync = async (
  files: Awaited<ReturnType<AppRouter["filesStats"]["upsert"]>>,
) => {
  Object.keys(files).forEach((filePath) => {
    const file = files[filePath];
    const now = performance.now();

    if (filesData[filePath]) {
      filesData[filePath].elapsedTime = file.timeSpent;
      return;
    }

    filesData[filePath] = {
      elapsedTime: file.timeSpent,
      frozenTime: null,
      freezeStartTime: null,
      isFrozen: false,
      lastActivityTime: now,
      startTime: now - file.timeSpent * 1000,
      projectName: file.projectName,
      projectPath: file.projectPath,
      languageSlug: file.languageSlug,
      fileName: file.fileName,
    };
  });
};

export default updateFilesDataAfterSync;
