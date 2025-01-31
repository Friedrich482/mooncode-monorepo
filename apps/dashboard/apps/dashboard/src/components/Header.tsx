import { Button } from "./ui/button";
import NavbarDropDowns from "./NavbarDropDowns";

const Header = () => {
  return (
    <header className="fixed top-0 flex w-dvw gap-3 border-b border-neutral-800 bg-neutral-100 px-10 pb-2 pt-2 text-3xl dark:bg-neutral-950">
      <div>Logo here</div>
      <nav className="flex flex-1 justify-end pr-12">
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
      </nav>
      <NavbarDropDowns />
    </header>
  );
};

export default Header;
