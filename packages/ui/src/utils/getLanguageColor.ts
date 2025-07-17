import { DEFAULT_COLOR } from "../constants";
import languagesAttributes from "../colors.json";
const getLanguageColor = (languageSlug: string) => {
  let languageColor: string = "";
  try {
    languageColor =
      languagesAttributes[languageSlug as keyof typeof languagesAttributes]
        .color;
  } catch {
    languageColor = DEFAULT_COLOR;
  }
  return languageColor;
};

export default getLanguageColor;
