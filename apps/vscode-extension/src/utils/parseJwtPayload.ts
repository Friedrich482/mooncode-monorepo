import { JWTPayloadSchema } from "../types-schemas";
import { SafeParseSuccess } from "zod";

const parseJwtPayload = (
  token: string | undefined,
):
  | SafeParseSuccess<{
      sub: string;
      username: string;
      iat: number;
      exp: number;
    }>
  | {
      success: false;
      error: unknown;
    } => {
  try {
    if (!token || typeof token !== "string" || !token.includes(".")) {
      return { success: false, error: new Error("Invalid token format") };
    }

    const base64Payload = token.split(".")[1];
    const decodedPayload = atob(base64Payload);
    const jsonPayload = JSON.parse(decodedPayload);

    return JWTPayloadSchema.safeParse(jsonPayload);
  } catch (error) {
    return { success: false, error };
  }
};

export default parseJwtPayload;
