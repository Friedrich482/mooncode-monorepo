import { LayoutDashboard, LucideProps, Monitor, Moon, Sun } from "lucide-react";
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
import { GroupBy } from "@repo/utils/types";
import { Theme } from "@/components/themeProvider";

export const THEME_DROPDOWN_ITEMS: {
  text: string;
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  theme: Theme;
}[] = [
  { text: "Light", Icon: Sun, theme: "light" },
  { text: "Dark", Icon: Moon, theme: "dark" },
  { text: "System", Icon: Monitor, theme: "system" },
];

export const AUTH_DROPDOWN_ITEMS: {
  text: string;
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  url: string;
}[] = [
  {
    text: "Dashboard",
    Icon: LayoutDashboard,
    url: "/dashboard",
  },
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

export const PERIODS_CONFIG = {
  "Last 7 days": {
    start: subDays(new Date(), 6).toLocaleDateString(),
    end: new Date().toLocaleDateString(),
  },
  "This week": {
    start: startOfWeek(new Date()).toLocaleDateString(),
    end: new Date().toLocaleDateString(),
  },
  "Last week": {
    start: startOfWeek(subWeeks(new Date(), 1)).toLocaleDateString(),
    end: endOfWeek(subWeeks(new Date(), 1)).toLocaleDateString(),
  },
  "Last 14 days": {
    start: subDays(new Date(), 13).toLocaleDateString(),
    end: new Date().toLocaleDateString(),
  },
  "Last 2 weeks": {
    start: startOfWeek(subWeeks(new Date(), 2)).toLocaleDateString(),
    end: endOfWeek(subWeeks(new Date(), 1)).toLocaleDateString(),
  },
  "This month": {
    start: startOfMonth(new Date()).toLocaleDateString(),
    end: new Date().toLocaleDateString(),
  },
  "Last month": {
    start: startOfMonth(subMonths(new Date(), 1)).toLocaleDateString(),
    end: endOfMonth(subMonths(new Date(), 1)).toLocaleDateString(),
  },
  "This year": {
    start: startOfYear(new Date()).toLocaleDateString(),
    end: new Date().toLocaleDateString(),
  },
  "Last year": {
    start: startOfYear(subYears(new Date(), 1)).toLocaleDateString(),
    end: endOfYear(subYears(new Date(), 1)).toLocaleDateString(),
  },
  "Custom Range": {
    start: new Date().toLocaleDateString(),
    end: new Date().toLocaleDateString(),
  },
} as const;
