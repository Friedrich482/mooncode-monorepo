import { JWTDto } from "@repo/common/schemas";
import { JwtPayloadType } from "../../types-schemas";
import { SafeParseSuccess } from "zod";

const parseJwtPayload = (
  token: string | undefined,
):
  | SafeParseSuccess<JwtPayloadType>
  | {
      success: false;
      error: unknown;
    } => {
  try {
    if (!token || typeof token !== "string" || !token.includes(".")) {
      return { success: false, error: new Error("Invalid token format") };
    }

    const base64Payload = token.split(".")[1];
    const decodedPayload = Buffer.from(base64Payload, "base64").toString(
      "utf8",
    );
    const jsonPayload = JSON.parse(decodedPayload);

    return JWTDto.safeParse(jsonPayload);
  } catch (error) {
    return { success: false, error };
  }
};

export default parseJwtPayload;
