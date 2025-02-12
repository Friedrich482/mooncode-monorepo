export type codingData = {
  timeSpentToday: number;
  timeSpentPerLanguage: Record<string, number>;
};

export type ExtendedRequest = Request & {
  user: {
    sub: string;
    username: string;
  };
};

export type Date = string;
