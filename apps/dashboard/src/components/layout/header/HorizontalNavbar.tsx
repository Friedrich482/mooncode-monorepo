import { Button } from "../../ui/button";

const HorizontalNavbar = () => {
  return (
    <nav className="flex flex-1 justify-end pr-12 max-small:hidden">
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
  );
};

export default HorizontalNavbar;
