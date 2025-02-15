import { ZodSchema } from "zod";

const fetchAndParseTime = async <T>(
  authToken: string,
  route: string,
  offset: number,
  schema: ZodSchema<T>,
) => {
  const res = await fetch(
    `http://localhost:3000/api/coding-data/${route}?offset=${offset}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    },
  );

  const data = await res.json();

  const parsedData = schema.safeParse(data);

  if (!parsedData.success) {
    let errorMessage = "";
    parsedData.error.issues.forEach((issue) => {
      errorMessage += issue.message;
    });
    throw new Error(errorMessage);
  }
  return parsedData.data;
};

export default fetchAndParseTime;
