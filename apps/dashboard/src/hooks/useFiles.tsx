import { PERIODS_CONFIG } from "@/constants";
import { ProjectParamsSchema } from "@/types-schemas";
import { usePeriodStore } from "./store/periodStore";
import useSafeParams from "./useSafeParams";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";

const useFiles = (languagesToFetch: string[] | undefined) => {
  const { projectName: name } = useSafeParams(ProjectParamsSchema);
  const period = usePeriodStore((state) => state.period);
  const customRange = usePeriodStore((state) => state.customRange);
  const trpc = useTRPC();

  const { data: filesData } = useSuspenseQuery(
    trpc.filesStats.getProjectFilesOnPeriod.queryOptions(
      period === "Custom Range"
        ? {
            name,
            start: customRange.start,
            end: customRange.end,
            languages: languagesToFetch,
          }
        : {
            name,
            start: PERIODS_CONFIG[period].start,
            end: PERIODS_CONFIG[period].end,
            languages: languagesToFetch,
          },
    ),
  );

  const files = Object.entries(filesData);

  const groups = Object.entries(
    files.reduce(
      (
        acc: {
          [languageSlug: string]: ((typeof files)[number][1] & {
            filePath: string;
          })[];
        },
        [filePath, file],
      ) => {
        const { languageSlug } = file;

        if (!acc[languageSlug]) {
          acc[languageSlug] = [];
        }

        acc[languageSlug].push({ ...file, filePath });

        return acc;
      },
      {},
    ),
  );

  return { groups, files };
};

export default useFiles;
