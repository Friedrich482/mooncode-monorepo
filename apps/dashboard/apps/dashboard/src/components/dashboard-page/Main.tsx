import TimeSpentOnPeriod from "./TimeSpentOnPeriod";
import WeekTimeChart from "./WeekTimeChart";

const Main = () => {
  return (
    <main className="flex flex-col gap-4 px-14 text-black dark:text-white">
      <TimeSpentOnPeriod />
      <WeekTimeChart />
    </main>
  );
};

export default Main;
