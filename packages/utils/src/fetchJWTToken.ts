import { LOGIN_URL } from "./constants";

const fetchJWTToken = async (username: string, password: string) => {
  const res = await fetch(LOGIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: `{"json": ${JSON.stringify({
      username,
      password,
    })}
    }`,
  });

  if (!res.ok) {
    const errorData = await res.json();

    throw new Error(
      (errorData as { error: { message: string } }).error.message,
    );
  }

  return res.json();
};

export default fetchJWTToken;
