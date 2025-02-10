import { LanguagesData } from "./types-schemas";

export const MAX_IDLE_TIME = 600; //seconds

export const localUrlPort = 4208;
export const localUrl = `http://localhost:${localUrlPort}`;

export let languagesData: LanguagesData = {};

export const INITIAL_DATA_URL =
  "http://localhost:3000/api/coding-data/all/today";

export const PERIODIC_DATA_SYNC_URL = "http://localhost:3000/api/coding-data";

export const REGISTER_URL = "http://localhost:3000/api/auth/register";

export const LOGIN_URL = "http://localhost:3000/api/auth/login";
