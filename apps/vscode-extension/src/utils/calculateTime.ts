import * as vscode from "vscode";
import { FileMap, LanguageMap } from "../types-schemas";
import { MAX_IDLE_TIME, filesData, languagesData } from "../constants";
import getCurrentFileProperties from "./files/getCurrentFileProperties";
import getGlobalStateData from "./getGlobalStateData";
import getLanguageId from "./languages/getLanguageId";
import updateCurrentFileObj from "./files/updateCurrentFileObj";
import updateCurrentLanguage from "./languages/updateCurrentLanguage";

const calculateTime = async (): Promise<
  () => { languagesData: LanguageMap; filesData: FileMap }
> => {
  const disposables: vscode.Disposable[] = [];
  const { dailyData } = await getGlobalStateData();

  const idleCheckInterval = setInterval(() => {
    const now = performance.now();
    const latestLanguage = getLanguageId(
      vscode.window.activeTextEditor?.document,
    );

    const latestFile = getCurrentFileProperties(
      vscode.window.activeTextEditor?.document,
    );

    const todaysDateString = new Date().toLocaleDateString();

    if (!Object.hasOwn(dailyData, todaysDateString)) {
      Object.keys(languagesData).map((language) => {
        delete languagesData[language];
      });
      Object.keys(filesData).map((file) => {
        delete filesData[file];
      });
      //  TODO set the globalState data with initial data for the new day

      return;
    }

    Object.keys(languagesData).map((language) => {
      const languageData = languagesData[language];

      if (!latestLanguage || language !== latestLanguage) {
        // Immediately freeze non-active languages
        if (!languageData.isFrozen) {
          languageData.freezeStartTime = now;
          languageData.isFrozen = true;
          languageData.frozenTime = Math.floor(
            (now - languageData.startTime) / 1000,
          );
        }
        return; // Skip the rest of the checks for non-active languages
      }

      // Only check idle time for the active language
      const latestLanguageObj = languagesData[latestLanguage];

      const idleDuration = Math.floor(
        (now - latestLanguageObj.lastActivityTime) / 1000,
      );

      if (idleDuration >= MAX_IDLE_TIME && !latestLanguageObj.isFrozen) {
        latestLanguageObj.frozenTime = Math.floor(
          (now - latestLanguageObj.startTime) / 1000,
        );
        latestLanguageObj.freezeStartTime = now;
        latestLanguageObj.isFrozen = true;
      } else if (
        idleDuration < MAX_IDLE_TIME &&
        latestLanguageObj.isFrozen &&
        latestLanguageObj.freezeStartTime
      ) {
        const freezeDuration = Math.floor(
          (now - latestLanguageObj.freezeStartTime) / 1000,
        );
        latestLanguageObj.startTime += Math.floor(freezeDuration * 1000);
        latestLanguageObj.frozenTime = null;
        latestLanguageObj.freezeStartTime = null;
        latestLanguageObj.isFrozen = false;
      }
    });

    Object.keys(filesData).map((file) => {
      const fileData = filesData[file];

      if (!latestFile || file !== latestFile.absolutePath) {
        // Immediately freeze non-active files
        if (!fileData.isFrozen) {
          fileData.freezeStartTime = now;
          fileData.isFrozen = true;
          fileData.frozenTime = Math.floor((now - fileData.startTime) / 1000);
        }
        return; // Skip the rest of the checks for non-active files
      }

      // Only check idle time for the active files
      const latestFileObj = filesData[latestFile.absolutePath];

      const idleDuration = Math.floor(
        (now - latestFileObj.lastActivityTime) / 1000,
      );

      if (idleDuration >= MAX_IDLE_TIME && !latestFileObj.isFrozen) {
        latestFileObj.frozenTime = Math.floor(
          (now - latestFileObj.startTime) / 1000,
        );
        latestFileObj.freezeStartTime = now;
        latestFileObj.isFrozen = true;
      } else if (
        idleDuration < MAX_IDLE_TIME &&
        latestFileObj.isFrozen &&
        latestFileObj.freezeStartTime
      ) {
        const freezeDuration = Math.floor(
          (now - latestFileObj.freezeStartTime) / 1000,
        );
        latestFileObj.startTime += Math.floor(freezeDuration * 1000);
        latestFileObj.frozenTime = null;
        latestFileObj.freezeStartTime = null;
        latestFileObj.isFrozen = false;
      }
    });
  }, 1000);

  disposables.push({
    dispose: () => clearInterval(idleCheckInterval),
  });

  const activityListeners = [
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        updateCurrentLanguage(editor.document);
        updateCurrentFileObj(editor.document);
      }
    }),

    vscode.workspace.onDidChangeTextDocument((event) => {
      if (
        vscode.window.activeTextEditor &&
        event.document === vscode.window.activeTextEditor.document
      ) {
        updateCurrentLanguage(event.document);
        updateCurrentFileObj(event.document);
      }
    }),
  ];

  disposables.push(...activityListeners);

  const getTime = () => {
    // Update all languages times
    Object.keys(languagesData).forEach((language) => {
      const languageData = languagesData[language];
      const now = performance.now();
      languageData.elapsedTime =
        languageData.isFrozen && languageData.frozenTime
          ? languageData.frozenTime
          : parseInt(((now - languageData.startTime) / 1000).toFixed(0));
    });

    // Update all files times
    Object.keys(filesData).forEach((file) => {
      const fileData = filesData[file];
      const now = performance.now();
      fileData.elapsedTime =
        fileData.isFrozen && fileData.frozenTime
          ? fileData.frozenTime
          : parseInt(((now - fileData.startTime) / 1000).toFixed(0));
    });

    return { languagesData, filesData };
  };

  (getTime as any).dispose = () => {
    disposables.forEach((d) => d.dispose());
  };

  return getTime;
};

export default calculateTime;
