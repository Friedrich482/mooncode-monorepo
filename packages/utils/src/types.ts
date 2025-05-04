import { JWTDto, RegisterUserDto, SignInUserDto } from "./schemas";
import { LOGIN_URL, REGISTER_URL } from "./constants";
import z from "zod";

export const GroupByZEnum = ["days", "weeks", "months"] as const;
export type GroupBy = (typeof GroupByZEnum)[number];

export type PeriodResolution = "day" | "week" | "month" | "year";

export type JwtPayloadDtoType = z.infer<typeof JWTDto>;
export type SignInUserDtoType = z.infer<typeof SignInUserDto>;
export type RegisterUserDtoType = z.infer<typeof RegisterUserDto>;

export type TrpcAuthError = {
  error: {
    json: {
      message: string;
    };
  };
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tuple = [REGISTER_URL, LOGIN_URL] as const;
export type AuthEndPointURL = (typeof tuple)[number];
