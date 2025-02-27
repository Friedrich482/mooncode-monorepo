import TimeSpentOnPeriod from "./TimeSpentOnPeriod";
import WeekLanguagesChart from "./charts/WeekLanguagesChart";
import WeekTimeChart from "./charts/WeekTimeChart";

const Main = () => {
  return (
    <main className="flex flex-col gap-10 px-14 pb-4 text-black dark:text-white">
      <TimeSpentOnPeriod />
      <div className="max-chart:flex-col max-chart:gap-20 flex items-center justify-between gap-10">
        <WeekTimeChart />
        <WeekLanguagesChart />
      </div>
    </main>
  );
};

export default Main;
