import Icon from "@repo/ui/components/ui/Icon";
import { Menu } from "lucide-react";
import SideBar from "./SideBar";
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
      <SideBar isOpen={isOpen} handleClick={handleClick} />
    </>
  );
};

export default BurgerMenu;
