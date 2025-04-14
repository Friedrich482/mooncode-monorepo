import type { GroupBy, PeriodResolution } from "@repo/utils/types";
import { Period } from "@/types-schemas";
import { create } from "zustand";
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

export const usePeriodStore = create<Store>((set) => ({
  period: "Last 7 days",
  setPeriod: (newPeriod) => set({ period: newPeriod }),
  groupBy: "days",
  setGroupBy: (newGroupBy) => set({ groupBy: newGroupBy }),
  customRange: {
    start: new Date().toLocaleDateString(),
    end: new Date().toLocaleDateString(),
    periodResolution: "month",
  },
  setCustomRange: (newCustomRange) => set({ customRange: newCustomRange }),
}));
