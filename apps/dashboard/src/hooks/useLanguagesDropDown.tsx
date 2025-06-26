import { Entry, ProjectParamsSchema } from "@/types-schemas";
import { PERIODS_CONFIG } from "@/constants";
import getLanguageColor from "@/utils/getLanguageColor";
import getLanguageName from "@/utils/getLanguageName";
import { usePeriodStore } from "./store/periodStore";
import useSafeParams from "./useSafeParams";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";

const useLanguagesDropDown = ({
  selectedEntries,
  setSelectedEntries,
}: {
  selectedEntries: Entry[];
  setSelectedEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
}) => {
  const { projectName: name } = useSafeParams(ProjectParamsSchema);
  const trpc = useTRPC();
  const period = usePeriodStore((state) => state.period);
  const customRange = usePeriodStore((state) => state.customRange);

  const { data: fetchedData } = useSuspenseQuery(
    trpc.filesStats.getProjectLanguagesTimeOnPeriod.queryOptions(
      period === "Custom Range"
        ? { name, start: customRange.start, end: customRange.end }
        : {
            name,
            start: PERIODS_CONFIG[period].start,
            end: PERIODS_CONFIG[period].end,
          },
    ),
  );

  const languagesToDisplay: Entry[] = fetchedData.map((entry) => ({
    language: getLanguageName(entry.languageName),
    color: getLanguageColor(entry.languageName),
    languageId: entry.languageName,
  }));

  const handleCheck = (entry: Entry) =>
    setSelectedEntries((prev) => {
      const isEntryExisting = prev.some(
        (elt) => elt.languageId === entry.languageId,
      );

      return isEntryExisting
        ? prev.filter((elt) => elt.languageId !== entry.languageId)
        : [...prev, entry];
    });

  const isChecked = (entry: Entry) =>
    selectedEntries.some((elt) => elt.languageId === entry.languageId);

  return { handleCheck, isChecked, languagesToDisplay };
};

export default useLanguagesDropDown;
