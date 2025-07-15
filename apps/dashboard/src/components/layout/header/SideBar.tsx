import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/Icon";
import { Link } from "react-router";
import Logo from "./Logo";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const SideBar = ({
  isOpen,
  handleClick,
}: {
  isOpen: boolean;
  handleClick: () => void;
}) => (
  <nav
    className={cn(
      "absolute left-0 top-0 hidden h-dvh w-64 -translate-x-64 flex-col items-center justify-start gap-10 border-r border-r-neutral-700 bg-neutral-100 px-3 py-6 transition duration-300 ease-in-out dark:bg-neutral-950 max-small:flex",
      isOpen && "translate-x-0",
    )}
  >
    <div className="flex w-full items-center justify-between px-2">
      <a
        className="flex flex-shrink-0 items-center justify-center gap-2 text-2xl"
        href="/"
      >
        <Logo />
        <p className="font-bold">MoonCode</p>
      </a>
      <Icon onClick={handleClick} Icon={X} />
    </div>

    <ul className="">
      <li>
        <Button
          variant="secondary"
          asChild
          className="self-center bg-transparent text-neutral-700 shadow-none hover:bg-transparent hover:text-black dark:text-neutral-400 dark:hover:text-white"
        >
          <Link to="/dashboard">Dashboard</Link>
        </Button>
      </li>
    </ul>
  </nav>
);

export default SideBar;
