import AuthDropDown from "./AuthDropDown";
import ToggleThemeDropDown from "./ToggleThemeDropDown";

const NavbarDropDowns = () => {
  return (
    <div className="flex gap-4 self-end">
      <ToggleThemeDropDown />
      <AuthDropDown />
    </div>
  );
};

export default NavbarDropDowns;
