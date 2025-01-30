import { Button } from "./ui/button";
import ToggleThemeSelect from "./ToggleThemeSelect";

const Header = () => {
  return (
    <header className="font-geist flex w-full gap-3 pb-10 pt-2 text-3xl">
      <div>Logo here</div>
      <nav className="flex flex-1 justify-end pr-4">
        <ul className="flex flex-1 items-center justify-end gap-4 pr-12">
          <li>
            <Button
              variant="secondary"
              asChild
              className="self-center bg-transparent text-neutral-400 outline-yellow-50 hover:bg-transparent hover:text-white focus:outline-none focus:ring-0 focus:ring-moon"
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
