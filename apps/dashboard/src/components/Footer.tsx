import { trpc } from "@/utils/trpc";

const Footer = () => {
  const userQuery = trpc.usersRouter.getUserById.useQuery(
    { id: "01JKC44GWVF5ZA2AX05X6741WF" },
    {
      queryKey: [
        "usersRouter.getUserById",
        { id: "01JKC44GWVF5ZA2AX05X6741WF" },
      ],
    },
  );
  return (
    <footer className="mt-auto flex items-center justify-center border-t px-3 pb-3 pt-4 text-center dark:border-neutral-800">
      <p>
        Built by{" "}
        <a className="underline" href="https://github.com/Friedrich482">
          Friedrich482
        </a>{" "}
        .The code source is available on {userQuery.data?.username}
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
