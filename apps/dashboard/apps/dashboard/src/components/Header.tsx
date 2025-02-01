import HorizontalNavbar from "./HorizontalNavbar";
import NavbarDropDowns from "./NavbarDropDowns";
import Title from "./Title";

const Header = () => {
  return (
    <header className="max-small:px-3 max-small:justify-between fixed top-0 flex w-dvw gap-3 border-b border-neutral-800 bg-neutral-100 px-10 pb-2 pt-2 dark:bg-neutral-950">
      <Title />
      <HorizontalNavbar />
      <NavbarDropDowns />
    </header>
  );
};

export default Header;
