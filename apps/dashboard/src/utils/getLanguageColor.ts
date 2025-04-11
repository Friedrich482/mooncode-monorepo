import { DEFAULT_COLOR } from "@/constants";
import languagesAttributes from "@/colors.json";
const getLanguageColor = (languageId: string) => {
  let languageColor: string = "";
  try {
    languageColor =
      languagesAttributes[languageId as keyof typeof languagesAttributes].color;
  } catch (error) {
    console.error(error);
    languageColor = DEFAULT_COLOR;
  }
  return languageColor;
};

export default getLanguageColor;
