import { Button } from "./ui/button";
import ToggleThemeSelect from "./ToggleThemeSelect";

const Header = () => {
  return (
    <header className="flex w-full gap-3 border-b border-neutral-800 pb-2 pt-2 text-3xl">
      <div>Logo here</div>
      <nav className="flex flex-1 justify-end pr-4">
        <ul className="flex flex-1 items-center justify-end gap-4 pr-12">
          <li>
            <Button
              variant="secondary"
              asChild
              className="self-center bg-transparent text-neutral-700 shadow-none hover:bg-transparent hover:text-black dark:text-neutral-400 dark:hover:text-white"
            >
              <a href="/dashboard">Dashboard</a>
            </Button>
          </li>
        </ul>
        <ToggleThemeSelect />
      </nav>
    </header>
  );
};

export default Header;
