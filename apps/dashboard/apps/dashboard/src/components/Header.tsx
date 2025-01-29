import { Button } from "./ui/button";

const Header = () => {
  // make an array for links
  return (
    <header className="flex text-3xl gap-3 w-full font-geist pb-10">
      <div>Logo here</div>
      <nav className="flex-1">
        <ul className="flex items-center justify-end gap-4 pr-10">
          <li>
            <Button asChild>
              <a>Dashboard</a>
            </Button>
          </li>
        </ul>
        <div></div>
      </nav>
    </header>
  );
};

export default Header;
