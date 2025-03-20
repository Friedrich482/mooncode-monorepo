import { INITIAL_DATA_URL } from "../constants";
import { fetchInitialLanguagesDataSchema } from "../types-schemas";
import getToken from "./auth/getToken";

const fetchInitialLanguagesData = async () => {
  const authToken = await getToken();

  const res = await fetch(INITIAL_DATA_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  const data = await res.json();

  const parsedData = fetchInitialLanguagesDataSchema.safeParse(data);
  if (!parsedData.success) {
    throw new Error("Incorrect data type");
  }

  return parsedData.data;
};

export default fetchInitialLanguagesData;
