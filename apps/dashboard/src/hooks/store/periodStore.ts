import type { GroupBy, PeriodResolution } from "@repo/utils/types";
import { Period } from "@/types-schemas";
import { create } from "zustand";
import { getPeriodStoreValuesFromURL } from "@/utils/getPeriodStoreValuesFromURL";

type Store = {
  period: Period;

  setPeriod: (state: Period) => void;
  groupBy: GroupBy;

  setGroupBy: (state: GroupBy) => void;

  customRange: {
    start: string;
    end: string;
    periodResolution: PeriodResolution;
  };

  setCustomRange: (state: {
    start: string;
    end: string;
    periodResolution: PeriodResolution;
  }) => void;
};

const { period, customRange, groupBy } = getPeriodStoreValuesFromURL();

export const usePeriodStore = create<Store>((set) => ({
  period,
  setPeriod: (newPeriod) => set({ period: newPeriod }),
  groupBy: groupBy,
  setGroupBy: (newGroupBy) => set({ groupBy: newGroupBy }),
  customRange,
  setCustomRange: (newCustomRange) => set({ customRange: newCustomRange }),
}));
