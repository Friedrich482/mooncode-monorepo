export type codingData = {
  timeSpentToday: number;
  timeSpentPerLanguage: Record<string, number>;
};

export type ExtendedRequest = Request & {
  user: {
    sub: number;
    username: string;
  };
};
