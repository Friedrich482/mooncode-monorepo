import {
  failedOperationResponseSchema,
  loginResponseSchema,
} from "../constants";

const fetchToken = async (username: string, password: string) => {
  const res = await fetch("http://localhost:3000/api/auth/login", {
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
    return "Incorrect body type";
  }

  return parsedBody.data;
};
export default fetchToken;
