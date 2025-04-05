import { LucideProps, Monitor, Moon, Sun } from "lucide-react";
import { endOfWeek, startOfWeek, subDays, subWeeks } from "date-fns";
import { ChartConfig } from "@/components/ui/chart";
import { Theme } from "@/components/themeProvider";

export const themeDropDownItems: {
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
  "Custom Range",
] as const;

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
  // "This month": 0,
  // "Previous month": 1,
} as const;

export const offsets = {
  "Past week": 1,
  Today: 0,
  Yesterday: 1,
  "Last 3 days": 3,
  "This week": 0,
};
