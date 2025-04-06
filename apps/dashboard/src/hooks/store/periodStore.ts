import { Period } from "@/types-schemas";
import { create } from "zustand";
type Store = {
  period: Period;
  // eslint-disable-next-line no-unused-vars
  setPeriod: (state: Period) => void;
};

export const usePeriodStore = create<Store>((set) => ({
  period: "Last 7 days",
  setPeriod: (newPeriod) => set({ period: newPeriod }),
}));
