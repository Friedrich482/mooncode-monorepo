import { LOGIN_URL } from "./constants";

const fetchJWTToken = async (email: string, password: string) => {
  const res = await fetch(LOGIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // we pass json here because of superjson transformer
      json: {
        email,
        password,
      },
    }),
    credentials: "include",
  });

  // type this properly
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error.json.message);
  }

  return res.json();
};

export default fetchJWTToken;
