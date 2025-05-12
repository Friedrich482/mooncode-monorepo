import { Button } from "../ui/button";
import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <main className="flex h-dvh flex-col items-center gap-4 pt-8 text-black dark:text-white">
      <img src="broken_moon.svg" />
      <div className="text-8xl">404</div>
      <p>This Page Could Not Be Found</p>
      <Button asChild>
        <Link to="/dashboard">Go Home</Link>
      </Button>
    </main>
  );
};

export default NotFoundPage;
