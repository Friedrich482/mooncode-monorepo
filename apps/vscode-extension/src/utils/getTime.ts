import * as vscode from "vscode";
import { MAX_IDLE_TIME, languagesData } from "../constants";
import { type LanguagesData } from "../types-schemas";
import getLanguageId from "./getLanguageId";
import updateCurrentLanguage from "./updateCurrentLanguage";

const getTime = (): (() => LanguagesData) => {
  const disposables: vscode.Disposable[] = [];

  const idleCheckInterval = setInterval(() => {
    const now = performance.now();
    const latestLanguage = getLanguageId(
      vscode.window.activeTextEditor?.document.languageId,
    );

    Object.keys(languagesData).forEach((language) => {
      const languageData = languagesData[language];
      // reset the timer at 00:00 (local midnight)
      const date = new Date();
      if (
        date.getHours() === 0 &&
        date.getMinutes() === 0 &&
        date.getSeconds() === 0
      ) {
        delete languagesData[language];
        return;
      }

      if (language !== latestLanguage) {
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
  }, 1000);

  disposables.push({
    dispose: () => clearInterval(idleCheckInterval),
  });

  const activityListeners = [
    vscode.workspace.onDidChangeTextDocument((event) => {
      const currentLanguageId = event.document.languageId || "other";
      updateCurrentLanguage(currentLanguageId);
    }),
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        const currentLanguageId = editor.document.languageId || "other";
        updateCurrentLanguage(currentLanguageId);
      }
    }),
    vscode.window.onDidChangeVisibleTextEditors((editors) => {
      if (editors.length > 0) {
        const currentLanguageId = editors[0].document.languageId || "other";
        updateCurrentLanguage(currentLanguageId);
      }
    }),
  ];

  disposables.push(...activityListeners);

  // Time getter function
  const timeGetter = () => {
    // Update all languages times

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
