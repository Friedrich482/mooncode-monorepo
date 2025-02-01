import BurgerMenu from "./BurgerMenu";
import { Button } from "./ui/button";
import Logo from "./Logo";
import NavbarDropDowns from "./NavbarDropDowns";

const Header = () => {
  return (
    <header className="max-small:px-3 max-small:justify-between fixed top-0 flex w-dvw gap-3 border-b border-neutral-800 bg-neutral-100 px-10 pb-2 pt-2 dark:bg-neutral-950">
      {/* a component here */}
      <div className="flex items-center justify-center gap-3">
        <BurgerMenu />
        {/* a component */}
        <a
          className="flex flex-shrink-0 items-center justify-center gap-2 text-3xl"
          href="/"
        >
          <Logo />
          <p className="max-small:hidden font-bold">Mooncode</p>
        </a>
      </div>

      {/* another one, "horizontal navbar" */}
      <nav className="max-small:hidden flex flex-1 justify-end pr-12">
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
