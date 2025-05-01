import { JWTDto, RegisterUserDto, SignInUserDto } from "./schemas";
import z from "zod";

export const GroupByZEnum = ["days", "weeks", "months"] as const;
export type GroupBy = (typeof GroupByZEnum)[number];

export type PeriodResolution = "day" | "week" | "month" | "year";

export type JwtPayloadDtoType = z.infer<typeof JWTDto>;
export type SignInUserDtoType = z.infer<typeof SignInUserDto>;

export type RegisterUserDtoType = z.infer<typeof RegisterUserDto>;
