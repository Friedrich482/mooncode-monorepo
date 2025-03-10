import {
  failedOperationResponseSchema,
  loginResponseSchema,
} from "../../types-schemas";
import { LOGIN_URL } from "../../constants";

const fetchToken = async (username: string, password: string) => {
  const res = await fetch(LOGIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const statusCode = res.status;
  const body = await res.json();

  if (statusCode === 404 || statusCode === 401 || statusCode === 400) {
    const parsedBody = failedOperationResponseSchema.parse(body);
    return parsedBody.message;
  }

  const parsedBody = loginResponseSchema.safeParse(body);
  if (!parsedBody.success) {
    const errorMessage = parsedBody.error.message;
    return `Incorrect body type,${errorMessage}`;
  }

  return parsedBody.data;
};
export default fetchToken;
