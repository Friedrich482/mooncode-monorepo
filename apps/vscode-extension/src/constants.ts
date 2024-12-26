export type LanguageData = {
  elapsedTime: number;
  startTime: number;
  lastActivityTime: number;
  frozenTime: number | null;
  freezeStartTime: number | null;
  isFrozen: boolean;
};
export type LanguagesData = Record<string, LanguageData>;
export const MAX_IDLE_TIME = 60;
