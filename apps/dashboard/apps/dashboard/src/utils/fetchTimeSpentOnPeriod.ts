import {
  type Period,
  offsets,
  routes,
  timeSpentDailySchema,
} from "./types-schemas";
import getAuthToken from "./getAuthToken";

const fetchTimeSpentToday = async (period: Period) => {
  const authToken = getAuthToken();

  const offset = offsets[period];
  const route = routes[period];

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
  const parsedData = timeSpentDailySchema.safeParse(data);

  if (!parsedData.success) {
    let errorMessage = "";
    parsedData.error.issues.forEach((issue) => {
      errorMessage += issue.message;
    });
    throw new Error(errorMessage);
  }
  return parsedData.data.timeSpent;
};

export default fetchTimeSpentToday;
