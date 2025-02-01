import Icon from "./Icon";
import { Menu } from "lucide-react";
import VerticalNavbar from "./VerticalNavbar";
import useOutsideClick from "@/hooks/useOutsideClick";
import { useState } from "react";

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  useOutsideClick(setIsOpen);
  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <>
      <Icon
        className="hidden max-small:flex"
        onClick={handleClick}
        Icon={Menu}
      />
      <VerticalNavbar isOpen={isOpen} handleClick={handleClick} />
    </>
  );
};

export default BurgerMenu;
