import { ProjectParamsSchema, Tree } from "@/types-schemas";
import CircularPacking from "./CircularPacking";
import { PERIODS_CONFIG } from "@/constants";
import { usePeriodStore } from "@/hooks/store/periodStore";
import { useRef } from "react";
import useSafeParams from "@/hooks/useSafeParams";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";

const NUMBER_OF_FILES_TO_SHOW = 30;

const FilesCirclePackingChart = () => {
  const { projectName: name } = useSafeParams(ProjectParamsSchema);
  const period = usePeriodStore((state) => state.period);
  const customRange = usePeriodStore((state) => state.customRange);

  const trpc = useTRPC();

  const { data: fetched } = useSuspenseQuery(
    trpc.filesStats.getProjectFilesOnPeriod.queryOptions(
      period === "Custom Range"
        ? {
            name,
            start: customRange.start,
            end: customRange.end,
          }
        : {
            name,
            start: PERIODS_CONFIG[period].start,
            end: PERIODS_CONFIG[period].end,
          },
    ),
  );

  const childrenArray = Object.entries(fetched).slice(
    0,
    NUMBER_OF_FILES_TO_SHOW,
  );
  const data: Tree = {
    type: "node",
    name: "files",
    value: 0,
    key: "mainNode",
    children: childrenArray.map(([path, { name, totalTimeSpent }]) => ({
      type: "leaf",
      name,
      value: totalTimeSpent,
      key: path,
    })),
  };

  const parentDivRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="flex min-h-96 w-full flex-col gap-y-6 self-center rounded-md border border-neutral-600/50 p-3 text-2xl"
      ref={parentDivRef}
    >
      <h2 className="text-center text-2xl font-bold">Most used files</h2>
      <CircularPacking data={data} parentDivRef={parentDivRef} />
    </div>
  );
};

export default FilesCirclePackingChart;
