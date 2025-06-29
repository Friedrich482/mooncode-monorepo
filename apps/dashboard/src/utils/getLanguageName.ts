import languagesAttributes from "@/colors.json";

const getLanguageName = (languageSlug: string) => {
  let languageName: string = "";

  try {
    languageName =
      languagesAttributes[languageSlug as keyof typeof languagesAttributes]
        .name;
  } catch {
    languageName = "N/A";
  }
  return languageName;
};

export default getLanguageName;
