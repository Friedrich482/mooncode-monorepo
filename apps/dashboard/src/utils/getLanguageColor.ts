import { DEFAULT_COLOR } from "@/constants";
import languagesAttributes from "@/colors.json";
const getLanguageColor = (languageId: string) => {
  // TODO fix (string | null => string) this by adding colors to the colors.json file for languages like "COBOL"
  let languageColor: string | null = "";
  try {
    languageColor =
      languagesAttributes[languageId as keyof typeof languagesAttributes].color;
  } catch (error) {
    console.error(error);
    languageColor = DEFAULT_COLOR;
  }
  return languageColor || DEFAULT_COLOR;
};

export default getLanguageColor;
