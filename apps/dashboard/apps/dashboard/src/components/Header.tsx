import { Button } from "./ui/button";
import { Moon } from "lucide-react";

const Header = () => {
  // make an array for links
  return (
    <header className="font-geist flex w-full gap-3 pb-10 pt-2 text-3xl">
      <div>Logo here</div>
      <nav className="flex flex-1 justify-end pr-12">
        <ul className="flex flex-1 items-center justify-end gap-4 pr-8">
          <li>
            <Button
              variant="secondary"
              asChild
              className="bg-transparent text-neutral-400 outline-yellow-50 hover:bg-transparent hover:text-white focus:outline-none focus:ring-0 focus:ring-moon"
            >
              <a href="/dashboard">Dashboard</a>
            </Button>
          </li>
        </ul>
        <div className="flex flex-shrink-0 items-center gap-4">
          {/* extract this button in a component and loop in it */}
          <Button
            variant="outline"
            size="icon"
            className="inline-flex size-10 border-none bg-transparent text-white hover:bg-neutral-600 hover:text-white"
          >
            <Moon fill="white" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-none bg-transparent text-white hover:bg-neutral-600 hover:text-white"
          >
            <div className="rounded-full bg-neutral-100 px-2 py-1">a</div>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
