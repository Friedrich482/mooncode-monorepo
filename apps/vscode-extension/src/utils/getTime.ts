import * as vscode from "vscode";
import { LanguagesData, MAX_IDLE_TIME } from "../constants";

// get today's data from the server here
const languagesData: LanguagesData = {};

const updateLanguageData = (language: string) => {
  if (!languagesData[language]) {
    languagesData[language] = {
      elapsedTime: 0,
      startTime: performance.now(),
      lastActivityTime: performance.now(),
      frozenTime: null,
      freezeStartTime: null,
      isFrozen: false,
    };
  }
  return languagesData[language];
};

const getTime = (): (() => LanguagesData) => {
  const disposables: vscode.Disposable[] = [];

  const idleCheckInterval = setInterval(() => {
    const now = performance.now();

    Object.keys(languagesData).forEach((language) => {
      const languageData = languagesData[language];
      const idleDuration = Math.floor(
        (now - languageData.lastActivityTime) / 1000
      );

      if (idleDuration >= MAX_IDLE_TIME && !languageData.isFrozen) {
        languageData.frozenTime = Math.floor(
          (now - languageData.startTime) / 1000
        );
        languageData.freezeStartTime = now;
        languageData.isFrozen = true;
      } else if (
        idleDuration < MAX_IDLE_TIME &&
        languageData.isFrozen &&
        languageData.freezeStartTime
      ) {
        const freezeDuration = Math.floor(
          (now - languageData.freezeStartTime) / 1000
        );
        languageData.startTime += Math.floor(freezeDuration * 1000);
        languageData.frozenTime = null;
        languageData.freezeStartTime = null;
        languageData.isFrozen = false;
      }
    });
  }, 1000);

  disposables.push({
    dispose: () => clearInterval(idleCheckInterval),
  });

  const activityListeners = [
    vscode.workspace.onDidChangeTextDocument((event) => {
      const language = event.document.languageId || "Other";
      const languageData = updateLanguageData(language);
      languageData.lastActivityTime = performance.now();
    }),
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        const language = editor.document.languageId || "Other";
        const languageData = updateLanguageData(language);
        languageData.lastActivityTime = performance.now();
      }
    }),
    vscode.window.onDidChangeVisibleTextEditors((editors) => {
      if (editors.length > 0) {
        const language = editors[0].document.languageId || "Other";
        const languageData = updateLanguageData(language);
        languageData.lastActivityTime = performance.now();
      }
    }),
  ];

  disposables.push(...activityListeners);

  // Time getter function
  const timeGetter = () => {
    // Update all language times
    Object.keys(languagesData).forEach((language) => {
      const languageData = languagesData[language];
      const now = performance.now();

      languageData.elapsedTime =
        languageData.isFrozen && languageData.frozenTime
          ? languageData.frozenTime
          : parseInt(((now - languageData.startTime) / 1000).toFixed(0));
    });

    return languagesData;
  };

  (timeGetter as any).dispose = () => {
    disposables.forEach((d) => d.dispose());
  };

  return timeGetter;
};

export default getTime;
