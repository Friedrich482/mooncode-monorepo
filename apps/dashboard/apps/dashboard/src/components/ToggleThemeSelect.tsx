import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

const themeDropDownItems = [
  { text: "Light", Icon: Sun },
  { text: "Dark", Icon: Moon },
  { text: "System", Icon: Monitor },
];

const ToggleThemeSelect = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex size-10 flex-shrink-0 items-center justify-center border-none border-transparent bg-transparent p-0 text-white hover:bg-neutral-600 hover:text-white [&_svg]:size-auto">
          <Moon className="size-5 flex-shrink-0" fill="white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-32 translate-y-2 rounded-md border-[1px] border-neutral-700 bg-transparent p-2 hover:bg-transparent"
        align="end"
      >
        {themeDropDownItems.map(({ Icon, text }) => (
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-base text-white outline-0 hover:bg-neutral-800 hover:text-white"
            key={text}
          >
            <Icon className="size-5" />
            {text}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ToggleThemeSelect;
