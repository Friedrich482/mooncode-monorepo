import { REGISTER_URL } from "@repo/utils/constants";

const registerUser = async ({
  email,
  password,
  username,
}: {
  email: string;
  username: string;
  password: string;
}) => {
  const res = await fetch(REGISTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // we pass json here because of superjson
      json: {
        email,
        username,
        password,
      },
    }),
    credentials: "include",
  });
  if (!res.ok) {
    const errorData = await res.json();

    throw new Error(errorData.error.json.message);
  }

  return res.json();
};

export default registerUser;
