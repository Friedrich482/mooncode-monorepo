import { GroupBy, PeriodResolution } from "@repo/utils/types";
import { LucideProps, Monitor, Moon, Sun } from "lucide-react";
import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";
import { ChartConfig } from "@/components/ui/chart";
import { Period } from "./types-schemas";
import { Theme } from "@/components/themeProvider";

export const THEME_DROPDOWN_ITEMS: {
  text: string;
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  theme: Theme;
  fill?: string;
}[] = [
  { text: "Light", Icon: Sun, theme: "light" },
  { text: "Dark", Icon: Moon, theme: "dark", fill: "white" },
  { text: "System", Icon: Monitor, theme: "system" },
];
export const PERIODS = [
  "Last 7 days",
  "This week",
  "Last week",
  "Last 14 days",
  "Last 2 weeks",
  "This month",
  "Last month",
  "This year",
  "Last year",
  "Custom Range",
] as const;

export const WEEK_PERIODS = ["Last 7 days", "This week", "Last week"];
export const YEAR_PERIODS = ["This year", "Last year"];

export const GROUP_BY_DROPDOWN_ITEMS: {
  groupBy: GroupBy;
  text: string;
}[] = [
  { groupBy: "days", text: "Days" },
  { groupBy: "weeks", text: "Weeks" },
  { groupBy: "months", text: "Months" },
];

export const chartConfig = {
  time: {
    label: "Time spent",
    color: "#FFDC67",
  },
} satisfies ChartConfig;

export const DEFAULT_COLOR = "HSL(334, 90%, 51%)";

export const PERIODS_CONFIG: Record<
  Period,
  {
    // TODO use the dateStringDto to get the correct type for both start and end
    start: string;
    end: string;
    periodResolution: PeriodResolution;
  }
> = {
  "Last 7 days": {
    start: subDays(new Date(), 6).toLocaleDateString(),
    end: new Date().toLocaleDateString(),
    periodResolution: "day",
  },
  "This week": {
    start: startOfWeek(new Date()).toLocaleDateString(),
    end: new Date().toLocaleDateString(),
    periodResolution: "day",
  },
  "Last week": {
    start: startOfWeek(subWeeks(new Date(), 1)).toLocaleDateString(),
    end: endOfWeek(subWeeks(new Date(), 1)).toLocaleDateString(),
    periodResolution: "day",
  },
  "Last 14 days": {
    start: subDays(new Date(), 13).toLocaleDateString(),
    end: new Date().toLocaleDateString(),
    periodResolution: "week",
  },
  "Last 2 weeks": {
    start: startOfWeek(subWeeks(new Date(), 2)).toLocaleDateString(),
    end: endOfWeek(subWeeks(new Date(), 1)).toLocaleDateString(),
    periodResolution: "week",
  },
  "This month": {
    start: startOfMonth(new Date()).toLocaleDateString(),
    end: new Date().toLocaleDateString(),
    periodResolution: "month",
  },
  "Last month": {
    start: startOfMonth(subMonths(new Date(), 1)).toLocaleDateString(),
    end: endOfMonth(subMonths(new Date(), 1)).toLocaleDateString(),
    periodResolution: "month",
  },
  "This year": {
    start: startOfYear(new Date()).toLocaleDateString(),
    end: new Date().toLocaleDateString(),
    periodResolution: "year",
  },
  "Last year": {
    start: startOfYear(subYears(new Date(), 1)).toLocaleDateString(),
    end: endOfYear(subYears(new Date(), 1)).toLocaleDateString(),
    periodResolution: "year",
  },
  "Custom Range": {
    start: "",
    end: "",
    periodResolution: "month",
  },
};
