import * as vscode from "vscode";
import { knownLanguages, languageMapping } from "../../constants";

const getLanguageId = (document: vscode.TextDocument | undefined) => {
  if (!document || document.uri.scheme !== "file") {
    return;
  }

  let languageId = document.languageId;

  if (languageId === "plaintext" || languageId === "ignore") {
    const extension = document.uri.fsPath.split(".").pop()?.toLowerCase() ?? "";

    if (Object.hasOwn(knownLanguages, extension)) {
      return knownLanguages[extension];
    }
  }

  // if the languageId given by vscode is a subset of a language
  // for example dockerfile (subset of docker)
  // just assign it to the language itself instead of using that subset
  if (languageMapping[languageId]) {
    languageId = languageMapping[languageId];
  }

  return languageId;
};

export default getLanguageId;
