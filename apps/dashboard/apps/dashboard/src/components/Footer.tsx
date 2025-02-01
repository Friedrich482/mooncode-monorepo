const Footer = () => {
  return (
    <footer className="mt-auto flex items-center justify-center border-t pb-6 pt-4 dark:border-neutral-800">
      <p>
        Built by{" "}
        <a className="underline" href="https://github.com/Friedrich482">
          Friedrich482
        </a>{" "}
        .The code source is available on{" "}
        <a
          href="https://github.com/Friedrich482/mooncode-dashboard"
          className="underline"
        >
          GitHub
        </a>
      </p>
    </footer>
  );
};

export default Footer;
