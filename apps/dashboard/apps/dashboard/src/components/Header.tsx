const Header = () => {
  // make an array for links
  return (
    <header className="flex text-3xl gap-3 w-full justify-between font-geist">
      Logo here
      <nav className="flex">
        <ul className="flex items-center justify-center gap-4 pr-10">
          <li>
            <a href="">Dashboard</a>
          </li>
          <li>
            <a href="">Profile</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
