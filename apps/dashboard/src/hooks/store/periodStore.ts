import type { GroupBy, PeriodResolution } from "@repo/utils/types";
import { Period } from "@/types-schemas";
import correctGroupBy from "@/utils/correctGroupBy";
import { create } from "zustand";
import getPeriodStoreValuesFromURL from "@/utils/getPeriodStoreValuesFromURL";

type Store = {
  period: Period;

  // eslint-disable-next-line no-unused-vars
  setPeriod: (state: Period) => void;
  groupBy: GroupBy;

  // eslint-disable-next-line no-unused-vars
  setGroupBy: (state: GroupBy) => void;

  customRange: {
    start: string;
    end: string;
    periodResolution: PeriodResolution;
  };

  // eslint-disable-next-line no-unused-vars
  setCustomRange: (state: {
    start: string;
    end: string;
    periodResolution: PeriodResolution;
  }) => void;
};

const { period, customRange, groupBy } = getPeriodStoreValuesFromURL();
// don't trust the groupBy from the url, it doesn't necessary fit the periodResolution
// it can be "weeks" for periods like "Last 7 days", "This week" or "Last week"
const correctedGroupBy = correctGroupBy(period, customRange, groupBy);

export const usePeriodStore = create<Store>((set) => ({
  period,
  setPeriod: (newPeriod) => set({ period: newPeriod }),
  groupBy: correctedGroupBy,
  setGroupBy: (newGroupBy) => set({ groupBy: newGroupBy }),
  customRange,
  setCustomRange: (newCustomRange) => set({ customRange: newCustomRange }),
}));
