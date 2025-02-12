import getAuthToken from "./getAuthToken";

const fetchWeekTime = async () => {
  const authToken = getAuthToken();
  const date = new Date().toISOString();
  const res = await fetch(`http://localhost:3000/api/weeklyData?date=${date}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });
  const data = await res.json();
  console.log(data);
  return data;
};

export default fetchWeekTime;
