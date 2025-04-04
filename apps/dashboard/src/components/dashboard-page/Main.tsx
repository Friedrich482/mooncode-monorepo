import DayLanguagesChart from "./charts/dayLanguagesChart/DayLanguagesChart";
import MainStatsChart from "./charts/MainStatsChart";
import TimeSpentOnPeriod from "./TimeSpentOnPeriod";
import WeekLanguagesChart from "./charts/WeekLanguagesChart";
import WeekTimeChart from "./charts/WeekTimeChart";

const Main = () => {
  return (
    <main className="flex flex-col gap-x-10 gap-y-12 px-14 pb-4 text-black dark:text-white">
      <TimeSpentOnPeriod />
      <div className="flex items-center justify-between max-chart:flex-col max-chart:gap-20">
        <WeekTimeChart />
        <WeekLanguagesChart />
      </div>
      <div className="flex items-center justify-between max-chart:flex-col max-chart:gap-20">
        <DayLanguagesChart />
        <MainStatsChart />
      </div>
    </main>
  );
};

export default Main;
