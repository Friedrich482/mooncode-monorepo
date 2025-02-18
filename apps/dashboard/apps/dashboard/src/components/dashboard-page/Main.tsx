import TimeSpentOnPeriod from "./TimeSpentOnPeriod";
import WeekLanguagesChart from "./WeekLanguagesChart";
import WeekTimeChart from "./WeekTimeChart";

const Main = () => {
  return (
    <main className="flex flex-col gap-10 px-14 text-black dark:text-white">
      <TimeSpentOnPeriod />
      <div className="flex items-center justify-between gap-10 max-md:flex-col">
        <WeekTimeChart />
        <WeekLanguagesChart />
      </div>
    </main>
  );
};

export default Main;
