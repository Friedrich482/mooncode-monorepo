import TimeSpentOnPeriod from "./TimeSpentOnPeriod";
import WeekLanguagesChart from "./charts/WeekLanguagesChart";
import WeekTimeChart from "./charts/WeekTimeChart";

const Main = () => {
  return (
    <main className="flex flex-col gap-10 px-14 pb-4 text-black dark:text-white">
      <TimeSpentOnPeriod />
      <div className="flex items-center justify-between gap-10 max-md:flex-col max-md:gap-20">
        <WeekTimeChart />
        <WeekLanguagesChart />
      </div>
    </main>
  );
};

export default Main;
