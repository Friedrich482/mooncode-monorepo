import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { ChevronDown } from "lucide-react";
import { PERIODS_CONFIG } from "@/constants";
import { ProjectParamsSchema } from "@/types-schemas";
import { cn } from "@/lib/utils";
import formatDuration from "@repo/utils/formatDuration";
import getLanguageColor from "@/utils/getLanguageColor";
import getLanguageName from "@/utils/getLanguageName";
import { usePeriodStore } from "@/hooks/store/periodStore";
import useSafeParams from "@/hooks/useSafeParams";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";

const FilesList = () => {
  const { projectName: name } = useSafeParams(ProjectParamsSchema);
  const period = usePeriodStore((state) => state.period);
  const customRange = usePeriodStore((state) => state.customRange);
  const trpc = useTRPC();

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

  type Entry = {
    language: string;
    color: string;
    languageId: string;
  };

  const languagesToDisplay: Entry[] = [
    ...fetchedData.map((entry) => ({
      language: getLanguageName(entry.languageName),
      color: getLanguageColor(entry.languageName),
      languageId: entry.languageName,
    })),
  ];

  const [selectedEntries, setSelectedEntries] = useState<Entry[]>([]);

  const handleCheck = (entry: Entry) =>
    setSelectedEntries((prev) => {
      const existingEntry = prev.find(
        (elt) => elt.languageId === entry.languageId,
      );
      return existingEntry
        ? prev.filter((elt) => elt.languageId !== entry.languageId)
        : [...prev, entry];
    });

  const isChecked = (entry: Entry) =>
    selectedEntries.some((elt) => elt.languageId === entry.languageId);
  const languagesToFetch =
    selectedEntries.length !== 0
      ? selectedEntries.map((entry) => entry.languageId)
      : undefined;

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
          [language: string]: ((typeof files)[number][1] & {
            filePath: string;
          })[];
        },
        [filePath, file],
      ) => {
        const { language } = file;

        if (!acc[language]) {
          acc[language] = [];
        }

        acc[language].push({ ...file, filePath });

        return acc;
      },
      {},
    ),
  );
  const [isGrouped, setIsGrouped] = useState(false);

  return (
    <div className="flex min-h-96 w-full flex-col gap-y-6 self-center rounded-md border border-neutral-600/50 p-3 text-2xl">
      <h2 className="text-center text-2xl font-bold">Files List</h2>
      <div className="flex flex-wrap items-center gap-x-10 gap-y-5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              className="flex items-center justify-center gap-2 bg-neutral-200 dark:bg-accent"
            >
              <span>Languages</span>
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 p-2" align="start">
            {languagesToDisplay.map((entry) => (
              <DropdownMenuCheckboxItem
                checked={isChecked(entry)}
                key={entry.language}
                onCheckedChange={() => handleCheck(entry)}
                className="cursor-pointer gap-3 rounded-md py-1 text-base"
              >
                <span
                  className="size-4 rounded-full"
                  style={{
                    backgroundColor: entry.color,
                  }}
                />
                <span>{entry.language}</span>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex gap-4">
          <p>Group</p>
          <Checkbox
            className="size-8"
            checked={isGrouped}
            onCheckedChange={() => setIsGrouped((prev) => !prev)}
          />
        </div>
      </div>

      <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-4 pt-10 text-xl max-[42rem]:grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] max-[42rem]:gap-8">
        <ul className={cn("flex flex-col", isGrouped && "gap-14")}>
          {isGrouped
            ? groups.map(([language, files]) => (
                <ul
                  key={language}
                  className="relative rounded-md border p-4"
                  style={{ borderColor: getLanguageColor(language) }}
                >
                  <span
                    className="text-normal absolute -top-11 left-0 rounded-md p-2"
                    style={{ backgroundColor: getLanguageColor(language) }}
                  >
                    {getLanguageName(language)}
                  </span>
                  {files.map(({ filePath, name, totalTimeSpent }) => (
                    <li
                      key={filePath}
                      className="flex gap-x-3"
                      title={filePath}
                    >
                      <span className="whitespace-nowrap font-light">
                        {formatDuration(totalTimeSpent)}
                      </span>
                      <span className="min-h-9 w-full overflow-hidden text-ellipsis whitespace-nowrap font-bold">
                        {name}
                      </span>
                    </li>
                  ))}
                </ul>
              ))
            : files.map(([filePath, { name, totalTimeSpent }]) => (
                <li key={filePath} className="flex gap-x-3" title={filePath}>
                  <span className="whitespace-nowrap font-light">
                    {formatDuration(totalTimeSpent)}
                  </span>
                  <span className="min-h-9 w-full overflow-hidden text-ellipsis whitespace-nowrap font-bold">
                    {name}
                  </span>
                </li>
              ))}
        </ul>
      </div>
    </div>
  );
};

export default FilesList;
