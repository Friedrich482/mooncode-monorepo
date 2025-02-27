import { z } from "zod";

const getAuthToken = () => {
  return z.string().min(1).parse(localStorage.getItem("auth-token"));
};

export default getAuthToken;
