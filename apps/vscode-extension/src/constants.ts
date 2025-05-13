import { LanguagesData } from "./types-schemas";

export const MAX_IDLE_TIME = 600; //seconds

export const forbiddenLanguages = ["scminput", "code-runner-output"];
export const languageMapping: Record<string, string> = {
  dockercompose: "docker",
  dockerfile: "docker",
  javascriptreact: "javascript",
  typescriptreact: "typescript",
  jsonc: "json",
};

export const localUrlPort = 4208;
export const localUrl = `http://localhost:${localUrlPort}`;

export let languagesData: LanguagesData = {};
export const SYNC_DATA_KEY = "mooncodeData";
