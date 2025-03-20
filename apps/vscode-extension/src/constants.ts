import { LanguagesData } from "./types-schemas";

export const MAX_IDLE_TIME = 600; //seconds

export const forbiddenLanguages = ["scminput"];
export const languageMapping: Record<string, string> = {
  dockercompose: "docker",
  dockerfile: "docker",
  javascriptreact: "javascript",
  typescriptreact: "typescript",
};

export const localUrlPort = 4208;
export const localUrl = `http://localhost:${localUrlPort}`;

export let languagesData: LanguagesData = {};

// those urls are going in the .env file if necessary

export const PERIODIC_DATA_SYNC_URL = "http://localhost:3000/api/coding-data";

export const REGISTER_URL = "http://localhost:3000/api/auth/register";
