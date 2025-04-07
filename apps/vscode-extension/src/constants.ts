import { LanguagesData } from "./types-schemas";

export const MAX_IDLE_TIME = 600; //seconds

export const forbiddenLanguages = ["scminput", "code-runner-output"];
export const languageMapping: Record<string, string> = {
  dockercompose: "docker",
  dockerfile: "docker",
  javascriptreact: "javascript",
  typescriptreact: "typescript",
};

export const localUrlPort = 4208;
export const localUrl = `http://localhost:${localUrlPort}`;
export const LOGIN_URL = "http://localhost:3000/trpc/auth.signInUser";
export const REGISTER_URL = "http://localhost:3000/trpc/auth.registerUser";

export let languagesData: LanguagesData = {};
