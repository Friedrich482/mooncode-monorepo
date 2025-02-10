import {
  failedOperationResponseSchema,
  registerResponseSchema,
} from "../types-schemas";
import { REGISTER_URL } from "../constants";

const createUser = async (
  username: string,
  password: string,
  email: string
) => {
  const res = await fetch(REGISTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      email,
    }),
  });
  const statusCode = res.status;
  const body = await res.json();

  if (statusCode === 400 || statusCode === 409) {
    const parsedBody = failedOperationResponseSchema.parse(body);
    return parsedBody.message;
  }
  const parsedBody = registerResponseSchema.safeParse(body);
  if (!parsedBody.success) {
    return "Incorrect body type";
  }
  return parsedBody.data;
};

export default createUser;
