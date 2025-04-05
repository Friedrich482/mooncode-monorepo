import DayLanguagesChart from "./charts/dayLanguagesChart/DayLanguagesChart";
import MainStatsChart from "./charts/GeneralStatsChart";
import TimeSpentOnPeriod from "./TimeSpentOnPeriod";
import WeeklyPeriodLanguagesChart from "./charts/WeeklyPeriodLanguagesChart";
import WeeklyPeriodTimeChart from "./charts/WeeklyPeriodTimeChart";

const Main = () => {
  return (
    <main className="flex flex-col gap-x-10 gap-y-12 px-14 pb-4 text-black dark:text-white">
      <TimeSpentOnPeriod />
      <div className="flex items-center justify-between max-chart:flex-col max-chart:gap-20">
        <WeeklyPeriodTimeChart />
        <WeeklyPeriodLanguagesChart />
      </div>
      <div className="flex items-center justify-between max-chart:flex-col max-chart:gap-20">
        <DayLanguagesChart />
        <MainStatsChart />
      </div>
    </main>
  );
};

export default Main;
