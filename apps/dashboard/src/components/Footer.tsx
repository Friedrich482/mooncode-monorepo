import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";

const Footer = () => {
  const trpc = useTRPC();
  const userQuery = useQuery(trpc.users);
  console.log(userQuery);
  return (
    <footer className="mt-auto flex items-center justify-center border-t px-3 pb-3 pt-4 text-center dark:border-neutral-800">
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
