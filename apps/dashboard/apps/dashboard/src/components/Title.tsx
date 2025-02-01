import BurgerMenu from "./BurgerMenu";
import Logo from "./Logo";

const Title = () => {
  return (
    <div className="flex items-center justify-center gap-3">
      <BurgerMenu />
      <a
        className="flex flex-shrink-0 items-center justify-center gap-2 text-3xl"
        href="/"
      >
        <Logo />
        <p className="max-small:hidden font-bold">Mooncode</p>
      </a>
    </div>
  );
};

export default Title;
