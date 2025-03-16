import { z } from "zod";

const getAuthToken = () => {
  try {
    return z.string().min(1).parse(localStorage.getItem("auth-token"));
  } catch (error) {
    console.error(error);
    return "";
  }
};

export default getAuthToken;
