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

// TODO there is already a JwtPayload type in the extension,
// TODO try to share both
export type JwtPayload = {
  sub: string;
  username: string;
  iat: number;
  exp: number;
};

export type Date = string;
