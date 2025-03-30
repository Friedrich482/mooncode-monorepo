import { LucideProps, Monitor, Moon, Sun } from "lucide-react";
import { ChartConfig } from "@/components/ui/chart";
import { Period } from "./types-schemas";
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
export const periodDropDownItems: Period[] = [
  "Today",
  "Yesterday",
  "Last 3 days",
  "This week",
  "Past week",
  "Past 2 weeks",
  "Previous month",
];

export const chartConfig = {
  time: {
    label: "Time spent",
    color: "#FFDC67",
  },
} satisfies ChartConfig;

export const DEFAULT_COLOR = "HSL(334, 90%, 51%)";

export const offsets = {
  "Past week": 1,
  Today: 0,
  Yesterday: 1,
  "Last 3 days": 3,
  "This week": 0,
  "Past 2 weeks": 2,
  "This month": 0,
  "Previous month": 1,
} as const;
