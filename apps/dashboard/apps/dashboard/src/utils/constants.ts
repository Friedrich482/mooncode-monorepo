import { LucideProps, Monitor, Moon, Sun } from "lucide-react";
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
