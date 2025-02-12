import * as vscode from "vscode";
import { MAX_IDLE_TIME, languagesData } from "../constants";
import { type LanguagesData } from "../types-schemas";

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
    const latestLanguage =
      vscode.window.activeTextEditor?.document.languageId || "other";

    Object.keys(languagesData).forEach((language) => {
      const languageData = languagesData[language];

      // reset the timer at 00:00
      const date = new Date();
      if (
        date.getUTCHours() === 0 &&
        date.getUTCMinutes() === 0 &&
        date.getUTCSeconds() < 10
      ) {
        languagesData[language] = {
          elapsedTime: 0,
          startTime: performance.now(),
          lastActivityTime: performance.now(),
          frozenTime: null,
          freezeStartTime: null,
          isFrozen: false,
        };
        return;
      }

      if (language !== latestLanguage) {
        // Immediately freeze non-active languages
        if (!languageData.isFrozen) {
          languageData.frozenTime = Math.floor(
            (now - languageData.startTime) / 1000
          );
          languageData.freezeStartTime = now;
          languageData.isFrozen = true;
        }
        return; // Skip the rest of the checks for non-active languages
      }

      // Only check idle time for the active language
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
      const language = event.document.languageId || "other";
      const languageData = updateLanguageData(language);
      languageData.lastActivityTime = performance.now();
    }),
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        const language = editor.document.languageId || "other";
        const languageData = updateLanguageData(language);
        languageData.lastActivityTime = performance.now();
      }
    }),
    vscode.window.onDidChangeVisibleTextEditors((editors) => {
      if (editors.length > 0) {
        const language = editors[0].document.languageId || "other";
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
