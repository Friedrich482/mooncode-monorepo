import { timeSpentTodaySchema } from "./types-schemas";
import { z } from "zod";

const fetchTimeSpentToday = async () => {
  const authToken = z.string().min(1).parse(localStorage.getItem("auth-token"));
  const date = new Date().toISOString();

  const res = await fetch(`http://localhost:3000/api/daily-data?date=${date}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  const data = await res.json();
  const parsedData = timeSpentTodaySchema.safeParse(data);

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
