import languagesAttributes from "@/colors.json";

const getLanguageName = (languageId: string) => {
  let languageName: string = "";

  try {
    languageName =
      languagesAttributes[languageId as keyof typeof languagesAttributes].name;
  } catch {
    // TODO fix this
    languageName = "Other";
  }
  return languageName;
};

export default getLanguageName;
