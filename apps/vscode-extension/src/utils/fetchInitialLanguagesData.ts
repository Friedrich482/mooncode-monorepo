import * as vscode from "vscode";
import { fetchInitialLanguagesDataSchema } from "../types-schemas";
import getToken from "./getToken";

const fetchInitialLanguagesData = async (context: vscode.ExtensionContext) => {
  const authToken = await getToken(context);
  const res = await fetch("http://localhost:3000/api/coding-data/all/today", {
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

  return parsedData.data.todayLanguages;
};

export default fetchInitialLanguagesData;
