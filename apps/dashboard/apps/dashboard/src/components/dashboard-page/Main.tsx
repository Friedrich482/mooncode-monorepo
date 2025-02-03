import TimeSpentTodaySkeleton from "../ui/skeleton/TimeSpentTodaySkeleton";
import fetchTimeSpentToday from "@/utils/fetchTimeSpentToday";
import { useQuery } from "@tanstack/react-query";

const Main = () => {
  // extract it in a custom hook
  const { isPending, error, data } = useQuery({
    queryKey: ["timeSpentToday"],
    queryFn: fetchTimeSpentToday,
  });

  return (
    <main className="px-14 text-black dark:text-white">
      <h1 className="flex items-center justify-center gap-4 text-2xl">
        <span>Today: </span>
        {isPending && <TimeSpentTodaySkeleton />}
        {error && (
          <span className="text-red-600">
            An error occurred: {error.message}
          </span>
        )}
        {data && `${data} seconds`}
      </h1>
    </main>
  );
};

export default Main;
