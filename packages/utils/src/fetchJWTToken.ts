import { AuthEndPointURL, TrpcAuthError } from "./types";
import { loginResponseSchema } from "./schemas";

const fetchJWTToken = async (
  endpointURL: AuthEndPointURL,
  body: {
    email: string;
    password: string;
    username?: string;
    callbackUrl: string | null;
  },
) => {
  const { email, password, username, callbackUrl } = body;
  console.log(callbackUrl);
  const res = await fetch(endpointURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // we pass json here because of superjson transformer
      json: username
        ? {
            email,
            password,
            username,
            callbackUrl,
          }
        : {
            email,
            password,
            callbackUrl,
          },
    }),
    credentials: "include",
  });

  // type this properly
  if (!res.ok) {
    const errorData = (await res.json()) as TrpcAuthError;
    throw new Error(errorData.error.json.message);
  }
  const data = await res.json();

  if (callbackUrl) {
    const {
      result: {
        data: {
          json: { access_token },
        },
      },
    } = loginResponseSchema.parse(data);

    return access_token;
  }
  return data;
};

export default fetchJWTToken;
