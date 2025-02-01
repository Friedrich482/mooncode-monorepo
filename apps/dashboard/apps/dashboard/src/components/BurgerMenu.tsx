import Icon from "./Icon";
import { Menu } from "lucide-react";
import VerticalNavbar from "./VerticalNavbar";
import { useState } from "react";

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <>
      <Icon className="max-small:flex hidden" onClick={handleClick}>
        <Menu />
      </Icon>
      <VerticalNavbar isOpen={isOpen} handleClick={handleClick} />
    </>
  );
};

export default BurgerMenu;
