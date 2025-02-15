import TimeSpentOnPeriod from "./TimeSpentOnPeriod";
import WeekTimeChart from "./WeekTimeChart";

const Main = () => {
  return (
    <main className="flex flex-col gap-10 px-14 text-black dark:text-white">
      <TimeSpentOnPeriod />
      <div className="flex flex-row items-center justify-between">
        <WeekTimeChart />
      </div>
    </main>
  );
};

export default Main;
