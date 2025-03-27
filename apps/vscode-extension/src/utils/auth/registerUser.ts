import { REGISTER_URL } from "../../constants";

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
      email,
      username,
      password,
    }),
  });
  if (!res.ok) {
    const errorData = await res.json();

    throw new Error(
      (errorData as { error: { message: string } }).error.message,
    );
  }
};

export default registerUser;
