import { filesData } from "@/constants";

const deleteFilesDataContent = () => {
  Object.keys(filesData).forEach((key) => {
    delete filesData[key];
  });
};

export default deleteFilesDataContent;
