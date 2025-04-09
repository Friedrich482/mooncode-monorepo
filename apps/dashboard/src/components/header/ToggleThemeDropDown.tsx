import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Moon, Sun } from "lucide-react";
import Icon from "../ui/Icon";
import { THEME_DROPDOWN_ITEMS } from "@/constants";
import { useTheme } from "../themeProvider";

const ToggleThemeDropDown = () => {
  const { setTheme, resolvedTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Icon Icon={resolvedTheme === "dark" ? Moon : Sun} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-32 translate-y-3 rounded-md border-[1px] border-neutral-700 bg-neutral-100 p-2 dark:bg-neutral-950"
        align="end"
      >
        {THEME_DROPDOWN_ITEMS.map(({ Icon, text, theme }) => (
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-base outline-0 hover:bg-neutral-200 hover:text-black dark:text-white dark:hover:bg-accent dark:hover:text-white"
            key={text}
            onClick={() => setTheme(theme)}
          >
            <Icon className="size-5" />
            {text}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ToggleThemeDropDown;
