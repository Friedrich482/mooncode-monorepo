import DashboardTitle from "./DashboardTitle";
import DayLanguagesChart from "./charts/dayLanguagesChart/DayLanguagesChart";
import GeneralStatsChart from "./charts/GeneralStatsChart";
import PeriodLanguagesChart from "./charts/PeriodLanguagesChart";
import PeriodTimeChart from "./charts/PeriodTimeChart";
import SuspenseBoundary from "../suspense/SuspenseBoundary";

const Dashboard = () => {
  document.title = "MoonCode | Dashboard";
  return (
    <main className="flex flex-col gap-x-10 gap-y-12 px-14 pb-4 text-black dark:text-white">
      <DashboardTitle />
      <div className="flex items-center justify-between max-chart:flex-col max-chart:gap-20">
        <SuspenseBoundary>
          <PeriodTimeChart />
        </SuspenseBoundary>
        <SuspenseBoundary>
          <PeriodLanguagesChart />
        </SuspenseBoundary>
      </div>
      <div className="flex items-center justify-between max-chart:flex-col max-chart:gap-20">
        <SuspenseBoundary>
          <DayLanguagesChart />
        </SuspenseBoundary>
        <SuspenseBoundary>
          <GeneralStatsChart />
        </SuspenseBoundary>
      </div>
    </main>
  );
};

export default Dashboard;
