import { filesData } from "@/constants";

const updateFilesDataElapsedTime = () => {
  const now = performance.now();

  // Update all files times
  Object.keys(filesData).forEach((file) => {
    const fileData = filesData[file];
    fileData.elapsedTime =
      fileData.isFrozen && fileData.frozenTime
        ? fileData.frozenTime
        : Math.floor((now - fileData.startTime) / 1000);
  });

  return filesData;
};

export default updateFilesDataElapsedTime;
