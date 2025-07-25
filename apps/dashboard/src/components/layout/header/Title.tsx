import BurgerMenu from "./BurgerMenu";
import { Link } from "react-router";
import Logo from "./Logo";

const Title = () => (
  <div className="flex items-center justify-center gap-3">
    <BurgerMenu />
    <Link
      className="flex flex-shrink-0 items-center justify-center gap-2 text-3xl"
      to="/dashboard"
    >
      <Logo />
      <p className="font-bold max-[33rem]:hidden">MoonCode</p>
    </Link>
  </div>
);

export default Title;
