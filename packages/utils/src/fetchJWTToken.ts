import { AuthEndPointURL, TrpcAuthError } from "./types";

const fetchJWTToken = async (
  endpointURL: AuthEndPointURL,
  body: { email: string; password: string; username?: string },
) => {
  const { email, password, username } = body;
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
          }
        : {
            email,
            password,
          },
    }),
    credentials: "include",
  });

  // type this properly
  if (!res.ok) {
    const errorData = (await res.json()) as TrpcAuthError;
    throw new Error(errorData.error.json.message);
  }

  return res.json();
};

export default fetchJWTToken;
